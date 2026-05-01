import { motion } from 'framer-motion';
import { Shield, UserPlus, LogIn, Lock } from 'lucide-react';

export default function AuthGate({ isSignUp, setIsSignUp, authInput, setAuthInput, handleAuth }) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-mono text-cyan-50">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border-2 border-cyan-500/30 bg-slate-900/90 p-10 rounded shadow-[0_0_50px_rgba(34,211,238,0.2)]"
      >
        <div className="text-center mb-8">
          {isSignUp ? <UserPlus className="mx-auto text-purple-500 mb-4" size={48} /> : <Shield className="mx-auto text-cyan-500 mb-4" size={48} />}
          <h1 className="text-2xl font-black uppercase tracking-widest">{isSignUp ? "New Awakening" : "System Gate"}</h1>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="text" required placeholder="USERNAME"
            className="w-full bg-slate-950 border border-slate-800 p-4 text-cyan-400 outline-none focus:border-cyan-500 text-center uppercase"
            value={authInput.username}
            onChange={(e) => setAuthInput({...authInput, username: e.target.value.toLowerCase()})}
          />
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
            <input 
              type="password" required placeholder="ACCESS_KEY"
              className="w-full bg-slate-950 border border-slate-800 p-4 text-cyan-400 outline-none focus:border-cyan-500 text-center tracking-[0.5em]"
              value={authInput.password}
              onChange={(e) => setAuthInput({...authInput, password: e.target.value})}
            />
          </div>
          <button className={`w-full py-4 font-black uppercase tracking-widest transition-all ${isSignUp ? 'bg-purple-600 hover:bg-purple-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-slate-900 shadow-lg`}>
            {isSignUp ? "Create Profile" : "Initialize Login"}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-6 text-[10px] text-slate-500 hover:text-cyan-400 uppercase tracking-widest">
          {isSignUp ? "Return to Login" : "New Hunter? Sign Up"}
        </button>
      </motion.div>
    </div>
  );
}