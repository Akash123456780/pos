import React, { useState } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, canInstall, isIOS, isDismissed, promptInstall, dismiss } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Do not show if already running in standalone mode or user dismissed this session
  if (isInstalled || isDismissed) {
    return null;
  }

  // Only show if can install or on iOS
  if (!canInstall && !isIOS) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald-500/30 text-white px-3 sm:px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">Install NEXUS OWNER App</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">PWA</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              Install on your home screen for quick remote store monitoring & offline access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {canInstall && (
            <button
              type="button"
              onClick={promptInstall}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && !canInstall && (
            <button
              type="button"
              onClick={() => setShowIOSInstructions(!showIOSInstructions)}
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Share className="w-3 h-3 text-emerald-400" />
              <span>How to Install</span>
            </button>
          )}

          <button
            type="button"
            onClick={dismiss}
            title="Dismiss banner"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Step-by-Step Guidance Dropdown */}
      {showIOSInstructions && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 max-w-7xl mx-auto text-xs text-slate-300 space-y-1.5 font-mono animate-in fade-in duration-150">
          <div className="font-bold text-emerald-400">Install on iPhone / iPad Safari:</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Tap the <strong>Share</strong> button <Share className="w-3 h-3 inline mx-0.5 text-blue-400" /> in Safari&apos;s bottom toolbar.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> <PlusSquare className="w-3 h-3 inline mx-0.5 text-emerald-400" />.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Tap <strong>Add</strong> in the top right. Launch directly from your home screen.</span>
          </div>
        </div>
      )}
    </div>
  );
};
