import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export const PWAUpdateModal: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;
        setRegistration(reg);

        // Check if there is already a waiting service worker
        if (reg.waiting) {
          setNeedRefresh(true);
        }

        // Listen for new service worker installation
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
              }
            });
          }
        });
      });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/40 text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>New NEXUS OWNER version available</span>
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Updated offline store intelligence and enhancements ready.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleUpdate}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-3 h-3 stroke-[2.5]" />
              <span>Update Now</span>
            </button>
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Later
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
