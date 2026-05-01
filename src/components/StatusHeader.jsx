import { motion } from 'framer-motion';
import { Edit2, BarChart3, LogOut, Calendar } from 'lucide-react';

export default function StatusHeader({ gameState, currentTheme, progress, xpRequired, setShowChart, setIsEditingName, isEditingName, setGameState, logout, displayDate }) {
  return (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`max-w-6xl mx-auto border-2 ${currentTheme.border} bg-slate-900/90 p-4 md:p-8 rounded-xl mb-6 md:mb-10 shadow-[0_0_40px_rgba(0,0,0,0.7)] relative overflow-hidden`}>
      {/* Background Aura */}
      <div className={`absolute inset-0 opacity-5 pointer-events-none transition-colors duration-1000`} style={{ backgroundColor: currentTheme.hex }}></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 relative z-10">
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${currentTheme.border} flex flex-col items-center justify-center bg-slate-950 shadow-[0_0_25px_var(--theme-color)] transition-all duration-1000`} 
            style={{ '--theme-color': currentTheme.hex }}
          >
            <span className={`text-xl md:text-3xl font-black ${currentTheme.text}`}>{gameState.level}</span>
            <span className={`text-[8px] md:text-[10px] font-bold uppercase ${currentTheme.text}`}>Level</span>
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar size={12} />
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest">{displayDate}</p>
            </div>
            {isEditingName ? (
              <input 
                autoFocus className="text-2xl md:text-4xl font-black bg-transparent border-b-2 border-cyan-500 outline-none text-white uppercase w-full"
                value={gameState.playerName}
                onChange={(e) => setGameState(prev => ({...prev, playerName: e.target.value.toUpperCase()}))}
                onBlur={() => setIsEditingName(false)}
              />
            ) : (
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                {gameState.playerName} <Edit2 size={16} className="opacity-20 cursor-pointer hover:opacity-100 text-cyan-400" onClick={() => setIsEditingName(true)} />
              </h1>
            )}
            <div className="flex gap-2 md:gap-4 mt-2">
              <span className={`text-[9px] md:text-[11px] font-black border-2 ${currentTheme.border} ${currentTheme.text} px-3 py-1 bg-slate-950/50 shadow-lg tracking-[0.2em]`}>{currentTheme.name}</span>
              <span className="text-[9px] md:text-[11px] text-orange-400 font-bold border-2 border-orange-500/30 px-3 py-1 bg-slate-950/50">🔥 {gameState.currentStreak} DAY STREAK</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: currentTheme.hex }}>
            <span>Experience Points: {gameState.xp} / {xpRequired}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }} 
              className="h-full transition-all duration-1000" 
              style={{ backgroundColor: currentTheme.hex, boxShadow: `0 0 15px ${currentTheme.hex}` }} 
            />
          </div>
          <div className="flex justify-between mt-5">
            <button onClick={() => setShowChart(true)} className="text-[9px] uppercase font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"><BarChart3 size={14}/> Analysis</button>
            <button onClick={logout} className="text-[9px] text-red-500/60 hover:text-red-500 uppercase font-bold flex items-center gap-1 transition-colors border-b border-transparent hover:border-red-500"><LogOut size={14}/> Terminate</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}