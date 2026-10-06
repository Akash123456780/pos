import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { finishSplash } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      finishSplash();
    }, 1800);
    return () => clearTimeout(timer);
  }, [finishSplash]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-6 text-white select-none">
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={finishSplash}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono uppercase tracking-wider"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center max-w-xs animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-2xl tracking-widest shadow-2xl shadow-emerald-500/30 mb-6">
          NX
        </div>

        <div className="text-2xl font-black tracking-tight text-white mb-1 font-sans">
          NEXUS OWNER
        </div>

        <div className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-widest mb-4">
          Professional Plan
        </div>

        <p className="text-sm text-slate-300 font-light italic">
          &quot;Your Business. Under Your Control.&quot;
        </p>

        <div className="mt-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Remote Store Terminal & Analytics</span>
        </div>
      </div>

      <div className="w-full text-center">
        <div className="w-8 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="w-full h-full bg-emerald-500 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-600 font-mono mt-3">
          NEXUS POS Cloud Systems India · v4.8.2
        </p>
      </div>
    </div>
  );
};
