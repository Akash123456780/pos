import React, { useState } from 'react';
import { 
  Settings, 
  ArrowLeft, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  ShieldCheck, 
  Info, 
  IndianRupee,
  Check,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage, LanguageCode } from '../../context/LanguageContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const { setSubView, isDarkMode, toggleTheme, showToast } = useApp();
  const { language, setLanguage } = useLanguage();

  const [notifSales, setNotifSales] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifDiscounts, setNotifDiscounts] = useState(true);
  const [notifExpiry, setNotifExpiry] = useState(true);

  const languages: { code: LanguageCode; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'Default' },
    { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'भारतीय भाषा' },
    { code: 'mr', label: 'मराठी (Marathi)', sub: 'महाराष्ट्र राज्य' },
  ];

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
            Store Preferences & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Regional language, display mode, alert triggers & terms
          </p>
        </div>
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
            Regional Language (Multi-Lingual)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  showToast({ type: 'success', title: 'Language Updated', message: `Interface set to ${lang.label}` });
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{lang.label}</div>
                  <div className="text-[11px] text-slate-400">{lang.sub}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* DISPLAY & THEME */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Application Visual Theme
            </div>
            <div className="text-[11px] text-slate-400">
              High contrast executive dashboard for day and low-light night shifts
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Active Currency</div>
            <div className="text-[11px] text-slate-400">Indian Rupee (₹) standard accounting format</div>
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            INR (₹)
          </span>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
            Real-Time Push Alerts & Warnings
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Daily Target & Spike Alerts</div>
              <div className="text-[11px] text-slate-400">Notify when daily sales breach milestones (₹50,000)</div>
            </div>
            <input
              type="checkbox"
              checked={notifSales}
              onChange={e => setNotifSales(e.target.checked)}
              className="rounded text-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Critical Low Stock Telemetry</div>
              <div className="text-[11px] text-slate-400">Notify when products fall below safe reorder levels</div>
            </div>
            <input
              type="checkbox"
              checked={notifStock}
              onChange={e => setNotifStock(e.target.checked)}
              className="rounded text-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Cashier Discount & Void Flags</div>
              <div className="text-[11px] text-slate-400">Alert owner when discounts exceed ₹100 or bills are voided</div>
            </div>
            <input
              type="checkbox"
              checked={notifDiscounts}
              onChange={e => setNotifDiscounts(e.target.checked)}
              className="rounded text-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* ABOUT NEXUS PLATFORM */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-3 text-xs text-slate-500">
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <span className="font-bold">Software Suite</span>
          <span className="font-mono">NEXUS POS Cloud v4.8.2-pro</span>
        </div>
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <span className="font-bold">Organization</span>
          <span>{BUSINESS_INFO.name} ({BUSINESS_INFO.gstin})</span>
        </div>
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <span className="font-bold">Encrypted Cloud Host</span>
          <span className="font-mono">AWS ap-south-1 (Mumbai Region)</span>
        </div>
        <p className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400">
          © 2026 NEXUS Technologies India Pvt. Ltd. All rights reserved. Designed specifically for retail store owners and business administrators.
        </p>
      </div>

    </div>
  );
};
