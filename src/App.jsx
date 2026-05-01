import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

import AuthGate from './components/AuthGate';
import StatusHeader from './components/StatusHeader';
import QuestLog from './components/QuestLog';
import GrowthChart from './components/GrowthChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authInput, setAuthInput] = useState({ username: "", password: "" });
  const [notification, setNotification] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);

  const [gameState, setGameState] = useState({
    playerName: "HUNTER", level: 1, xp: 0, habits: [], habitProgress: {}, currentStreak: 0, lastCheckIn: null
  });

  const [newHabit, setNewHobby] = useState("");
  const todayKey = new Date().toLocaleDateString('en-CA');
  const displayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // --- 1. RANK ENGINE ---
  const currentTheme = useMemo(() => {
    const lvl = gameState.level;
    if (lvl <= 5) return { name: "E-RANK", hex: "#64748b", text: "text-slate-400", border: "border-slate-500", shadow: "shadow-slate-500/20" };
    if (lvl <= 15) return { name: "D-RANK", hex: "#10b981", text: "text-emerald-400", border: "border-emerald-500", shadow: "shadow-emerald-500/20" };
    if (lvl <= 30) return { name: "C-RANK", hex: "#f59e0b", text: "text-yellow-400", border: "border-yellow-500", shadow: "shadow-yellow-500/20" };
    return { name: "S-RANK", hex: "#22d3ee", text: "text-cyan-400", border: "border-cyan-500", shadow: "shadow-cyan-500/20" };
  }, [gameState.level]);

  // --- 2. PENALTY & STREAK LOGIC ---
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`monarch_vFinal_${currentUser}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toLocaleDateString('en-CA');

        // Penalty Logic: If you missed yesterday, drop XP
        if (parsed.lastCheckIn && parsed.lastCheckIn !== todayKey && parsed.lastCheckIn !== yesterdayKey) {
          parsed.currentStreak = 0;
          parsed.xp = Math.max(0, parsed.xp - 5);
          setNotification("PENALTY QUEST: INACTIVITY DETECTED. XP DEDUCTED.");
        }
        setGameState(parsed);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(`monarch_vFinal_${currentUser}`, JSON.stringify(gameState));
  }, [gameState, currentUser]);

  // --- 3. LEVELING ENGINE ---
  const getXPReq = (lvl) => Math.min(10 + (lvl - 1) * 5, 50);
  const xpRequired = getXPReq(gameState.level);
  const progress = (gameState.xp / xpRequired) * 100;

  const toggleHabit = (name) => {
    setGameState(prev => {
      const isChecked = prev.habitProgress[todayKey]?.[name];
      let newXP = isChecked ? Math.max(0, prev.xp - 1) : prev.xp + 1;
      let newLvl = prev.level;

      if (!isChecked && newXP >= getXPReq(newLvl)) {
        newXP -= getXPReq(newLvl);
        newLvl++;
        // Check if a Rank milestone was hit
        if ([6, 16, 31].includes(newLvl)) setShowRankModal(true);
      }

      return {
        ...prev, level: newLvl, xp: newXP, lastCheckIn: todayKey,
        habitProgress: { ...prev.habitProgress, [todayKey]: { ...(prev.habitProgress[todayKey] || {}), [name]: !isChecked } }
      };
    });
  };

  const chartData = useMemo(() => {
    const labels = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 6 + i); return d.toLocaleDateString('en-CA');
    });
    return {
      labels: labels.map(l => l.split('-')[2]),
      datasets: [{
        label: 'QUESTS', data: labels.map(d => Object.values(gameState.habitProgress[d] || {}).filter(Boolean).length),
        borderColor: currentTheme.hex, backgroundColor: `${currentTheme.hex}22`, fill: true, tension: 0.4
      }]
    };
  }, [gameState.habitProgress, currentTheme]);

  if (!currentUser) return <AuthGate isSignUp={isSignUp} setIsSignUp={setIsSignUp} authInput={authInput} setAuthInput={setAuthInput} handleAuth={(e) => {
    e.preventDefault();
    const registry = JSON.parse(localStorage.getItem('monarch_users_vF') || "{}");
    const { username, password } = authInput;
    if (isSignUp) {
      if (registry[username]) return setNotification("ID TAKEN");
      registry[username] = password; localStorage.setItem('monarch_users_vF', JSON.stringify(registry));
      setCurrentUser(username);
    } else {
      if (registry[username] === password) setCurrentUser(username);
      else setNotification("INVALID KEY");
    }
  }} />;

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-50 p-4 md:p-10 font-mono relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[60]"></div>
      
      <StatusHeader 
        gameState={gameState} currentTheme={currentTheme} progress={progress} xpRequired={xpRequired}
        setShowChart={setShowChart} isEditingName={isEditingName} setIsEditingName={setIsEditingName} 
        setGameState={setGameState} logout={() => setCurrentUser(null)} displayDate={displayDate}
      />

      <QuestLog 
        gameState={gameState} currentTheme={currentTheme} newHabit={newHabit} setNewHobby={setNewHobby}
        addHabit={(e) => { e.preventDefault(); if(newHabit && !gameState.habits.includes(newHabit.trim())) { setGameState(p => ({...p, habits: [...p.habits, newHabit.trim()]})); setNewHobby(""); } }}
        toggleHabit={toggleHabit} removeHabit={(n) => setGameState(p => ({...p, habits: p.habits.filter(h => h !== n)}))} todayKey={todayKey}
      />

      <GrowthChart showChart={showChart} setShowChart={setShowChart} chartData={chartData} />

      {/* RANK UP MODAL */}
      <AnimatePresence>
        {showRankModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} className="text-center">
              <Trophy size={100} className={`${currentTheme.text} mx-auto mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,1)]`} />
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic">Rank Evolution</h2>
              <p className={`text-2xl font-black ${currentTheme.text} uppercase tracking-widest mb-10`}>You have ascended to {currentTheme.name}</p>
              <button onClick={() => setShowRankModal(false)} className="bg-white text-black px-12 py-4 font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">Return to HUD</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} onAnimationComplete={() => setTimeout(() => setNotification(""), 4000)} className={`fixed bottom-10 right-10 border-2 ${currentTheme.border} p-6 bg-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-[100]`}>
            <p className={`font-bold uppercase italic tracking-tighter ${currentTheme.text} flex items-center gap-3`}>
              <Star size={14} className="animate-spin" /> {notification}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;