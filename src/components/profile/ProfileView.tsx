import React from 'react';
import { 
  User, 
  ArrowLeft, 
  Shield, 
  Sparkles, 
  Settings, 
  LogOut, 
  Smartphone, 
  Building2, 
  Mail, 
  Phone, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const ProfileView: React.FC = () => {
  const { setSubView, setActiveTab } = useApp();
  const { user, logout } = useAuth();

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSubView('none')}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Owner Profile & Organization
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Executive administrator profile and store master controls
          </p>
        </div>
      </div>

      {/* USER HERO CARD */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm text-center sm:text-left">
        <div className="w-16 h-16 rounded-2xl bg-slate-950 dark:bg-emerald-600 text-white flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-lg">
          RS
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {user?.name || BUSINESS_INFO.ownerName}
              </h2>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Owner & Super Administrator
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-center sm:self-start">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{BUSINESS_INFO.planName}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs font-mono text-slate-500">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.name} ({BUSINESS_INFO.groupName})</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.ownerMobile}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{BUSINESS_INFO.ownerEmail}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Shield className="w-3.5 h-3.5" />
              <span>GSTIN: {BUSINESS_INFO.gstin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div 
          onClick={() => setSubView('professional-plan')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Plan Features</div>
              <div className="text-[11px] text-slate-400">10 Devices · 5 Branches</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div 
          onClick={() => setSubView('security')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Security Center</div>
              <div className="text-[11px] text-slate-400">PIN & Biometrics</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div 
          onClick={() => setSubView('settings')}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Store Settings</div>
              <div className="text-[11px] text-slate-400">Theme, Language</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* SIGN OUT BUTTON */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <button
          type="button"
          onClick={logout}
          className="py-2.5 px-6 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Owner App</span>
        </button>
      </div>

    </div>
  );
};
