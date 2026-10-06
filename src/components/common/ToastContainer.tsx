import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30 dark:border-emerald-500/30',
          warning: 'border-amber-500/30 dark:border-amber-500/30',
          error: 'border-rose-500/30 dark:border-rose-500/30',
          info: 'border-blue-500/30 dark:border-blue-500/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white dark:bg-slate-900 border ${borders[toast.type]} shadow-xl rounded-xl p-3 flex items-start gap-3 transition-all duration-200 animate-in slide-in-from-top-3`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
