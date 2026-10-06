import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Bell, 
  Search, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Moon, 
  Sun, 
  Check, 
  ShieldCheck,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_BRANCHES, BUSINESS_INFO } from '../../data/mockData';
import { BranchId } from '../../types';

export const Header: React.FC = () => {
  const { 
    activeBranchId, 
    setActiveBranchId, 
    isOnline, 
    toggleOnline, 
    isSyncing, 
    lastSyncedAgo, 
    syncNow,
    setIsSearchOpen,
    isDarkMode,
    toggleTheme,
    setSubView,
    setActiveTab
  } = useApp();

  const { user } = useAuth();
  const { t } = useLanguage();
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Close branch selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentBranchName = activeBranchId === 'all' 
    ? t('allBranches')
    : MOCK_BRANCHES.find(b => b.id === activeBranchId)?.name || 'Branch';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand & Branch Picker */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink">
          {/* Logo icon & brand */}
          <div 
            onClick={() => { setActiveTab('home'); setSubView('none'); }}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black tracking-wider text-xs sm:text-sm shadow-sm shadow-emerald-500/20">
              NX
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono leading-none truncate">
                NEXUS OWNER
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none mt-0.5 truncate max-w-[70px] xs:max-w-[100px] sm:max-w-none">
                {BUSINESS_INFO.name}
              </div>
            </div>
          </div>

          {/* Branch Selector Dropdown */}
          <div className="relative" ref={branchDropdownRef}>
            <button
              type="button"
              onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
              className="min-h-[38px] flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all max-w-[110px] xs:max-w-[130px] sm:max-w-[200px]"
              aria-label="Select store branch"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 hidden xs:block" />
              <span className="truncate">{currentBranchName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${isBranchMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBranchMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Select Business Branch
                </div>
                
                <button
                  type="button"
                  onClick={() => { setActiveBranchId('all'); setIsBranchMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors min-h-[44px] ${
                    activeBranchId === 'all' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{t('allBranches')}</span>
                  </div>
                  {activeBranchId === 'all' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-700/60 my-1" />

                {MOCK_BRANCHES.map(branch => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => { setActiveBranchId(branch.id as BranchId); setIsBranchMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors min-h-[44px] ${
                      activeBranchId === branch.id 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{branch.name}</div>
                      <div className="text-[10px] text-slate-400">{branch.city} · {branch.posCount} POS</div>
                    </div>
                    {activeBranchId === branch.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          
          {/* Online/Offline Status Indicator (Visible on mobile & desktop) */}
          <button
            type="button"
            onClick={toggleOnline}
            title={isOnline ? 'Online (Click to simulate offline)' : 'Offline (Click to go online)'}
            className={`min-h-[38px] flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-mono font-medium transition-colors ${
              isOnline 
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 hover:bg-emerald-100'
                : 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 hover:bg-amber-100'
            }`}
          >
            {isOnline ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <WifiOff className="w-3 h-3 text-amber-500 flex-shrink-0" />
            )}
            <span className="hidden xs:inline">{isOnline ? 'Live' : 'Offline'}</span>
          </button>

          {/* Sync Now Button */}
          <button
            type="button"
            onClick={syncNow}
            disabled={isSyncing}
            title={`Last sync: ${lastSyncedAgo}. Click to sync now`}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Synchronize data"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Global Search (Bills, Products, Customers)"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Search records"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => { setSubView('notifications'); }}
            title="Notification Center"
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Owner Avatar Profile */}
          <button
            type="button"
            onClick={() => setSubView('profile')}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-colors"
            title="Owner Profile & Settings"
            aria-label="Owner profile"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              RS
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
