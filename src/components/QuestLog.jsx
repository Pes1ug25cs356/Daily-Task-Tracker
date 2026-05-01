import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trash2, Sword, ShieldAlert } from 'lucide-react';

export default function QuestLog({ gameState, currentTheme, newHabit, setNewHobby, addHabit, toggleHabit, removeHabit, todayKey }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto bg-slate-900/60 border-2 border-slate-800 p-5 md:p-10 rounded-xl backdrop-blur-xl shadow-2xl relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 border-l-4 border-cyan-500 pl-4">
          <Sword className="text-cyan-500" size={24} />
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] text-white">Daily Quests</h2>
        </div>
        {gameState.habits.length === 0 && (
          <div className="flex items-center gap-2 text-slate-500 animate-pulse">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-bold uppercase">No Active Quests</span>
          </div>
        )}
      </div>

      <form onSubmit={addHabit} className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" value={newHabit} onChange={(e) => setNewHobby(e.target.value)}
          placeholder="Register a new daily objective..." 
          className="flex-1 bg-slate-950/80 border-2 border-slate-800 p-5 rounded-lg outline-none focus:border-cyan-500 transition-all uppercase text-sm font-bold tracking-widest text-cyan-50"
        />
        <button className="bg-cyan-600 hover:bg-cyan-400 text-slate-950 px-12 py-5 md:py-0 font-black uppercase tracking-widest shadow-lg shadow-cyan-900/20 active:scale-95 transition-all">Add Quest</button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {gameState.habits.map((habit) => {
            const isCompleted = gameState.habitProgress[todayKey]?.[habit];
            return (
              <motion.div 
                key={habit}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center justify-between p-5 rounded-lg border-2 transition-all group relative overflow-hidden ${isCompleted ? 'bg-slate-900/40' : 'bg-slate-950/40'} ${currentTheme.border}`}
              >
                {/* Visual completion strike */}
                {isCompleted && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute h-[1px] bg-cyan-500/20 top-1/2 left-0 pointer-events-none" />}
                
                <div className="flex flex-col">
                  <span className={`text-sm md:text-lg font-black uppercase italic tracking-wider transition-colors ${isCompleted ? 'text-slate-500 line-through' : currentTheme.text}`}>
                    {habit}
                  </span>
                  <p className="text-[8px] text-slate-600 uppercase mt-1 tracking-widest">Target: Daily Consistency</p>
                </div>

                <div className="flex items-center gap-4 md:gap-10">
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleHabit(habit)}
                    className="w-12 h-12 md:w-14 md:h-14 border-2 transition-all flex items-center justify-center rounded-sm"
                    style={{ 
                      backgroundColor: isCompleted ? currentTheme.hex : 'transparent',
                      borderColor: currentTheme.hex,
                      boxShadow: isCompleted ? `0 0 20px ${currentTheme.hex}` : 'none'
                    }}
                  >
                    {isCompleted && <CheckCircle2 size={28} className="text-slate-950" />}
                  </motion.button>
                  <button onClick={() => removeHabit(habit)} className="text-red-500/30 hover:text-red-500 p-2 transition-colors hover:bg-red-500/10 rounded">
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}