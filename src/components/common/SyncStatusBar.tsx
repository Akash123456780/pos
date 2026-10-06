import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const SyncStatusBar: React.FC = () => {
  const { isOnline, isSyncing, lastSyncedAgo, syncNow } = useApp();
  const { t } = useLanguage();

  if (isOnline && !isSyncing) {
    return null; // Keep screen clean when connected normally
  }

  return (
    <div className={`w-full py-1.5 px-4 text-xs font-medium flex items-center justify-between transition-colors ${
      !isOnline 
        ? 'bg-amber-500 text-slate-950 font-semibold' 
        : 'bg-emerald-600 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t('offlineBanner')}</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
            <span>Synchronizing with NEXUS Cloud POS server...</span>
          </>
        )}
      </div>

      {!isOnline && (
        <button
          type="button"
          onClick={syncNow}
          className="text-[11px] underline font-bold hover:text-black uppercase tracking-wider"
        >
          Retry
        </button>
      )}
    </div>
  );
};
