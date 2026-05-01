import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { X, TrendingUp } from 'lucide-react';

export default function GrowthChart({ showChart, setShowChart, chartData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <AnimatePresence>
      {showChart && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border-2 border-cyan-500/50 p-6 md:p-10 w-full max-w-4xl rounded-lg relative">
            <button onClick={() => setShowChart(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            <div className="flex items-center gap-3 mb-8 border-l-4 border-cyan-500 pl-4">
              <TrendingUp className="text-cyan-500" />
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Hunter Growth Curve</h2>
            </div>
            <div className="h-64 md:h-80"><Line data={chartData} options={options} /></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}