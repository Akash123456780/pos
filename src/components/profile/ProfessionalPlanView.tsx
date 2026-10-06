import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  MonitorDot, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const ProfessionalPlanView: React.FC = () => {
  const { setSubView, showToast } = useApp();
  const [showManageModal, setShowManageModal] = useState(false);

  const features = [
    'Owner Mobile App (iOS, Android & Tablet)',
    'Real-time Live Sales & Hourly Velocity',
    'Gross & Net Profit Analytics with COGS',
    'Encrypted Multi-Cloud POS Sync',
    'Multi-Branch Consolidated & Split View',
    'Staff Shifts, Cashier Audits & Anti-Theft Logs',
    'Instant Low Stock & Expiry Telemetry Alerts',
    'GST HSN Summaries & Audit Spreadsheets',
    'Automated Business Health Scoring (0-100)',
    'Remote POS Terminal Fleet Monitoring & Ping',
    'Customer Khata Ledger & Overdue Reminders',
    'Role-based Security Center with Master PIN',
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
            NEXUS Professional Subscription
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise store tier with unlimited remote synchronization
          </p>
        </div>
      </div>

      {/* PLAN HERO */}
      <div className="p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Current License Tier
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              NEXUS POS PROFESSIONAL
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Organization: <span className="font-semibold text-white">{BUSINESS_INFO.name}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Subscription Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active · Renews {BUSINESS_INFO.subscriptionExpiry}
            </span>
          </div>
        </div>

        {/* Quota meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-900/60 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Terminal Licenses:</span>
              <span className="font-bold text-white">{BUSINESS_INFO.deviceUsed} of {BUSINESS_INFO.deviceLimit} Devices Used</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Branch Outlets:</span>
              <span className="font-bold text-white">{BUSINESS_INFO.branchUsed} of {BUSINESS_INFO.branchLimit} Branches Active</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowManageModal(true)}
            className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* FEATURE MATRIX */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
          Included Professional Plan Capabilities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MANAGE SUBSCRIPTION MODAL */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-xs"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subscription Billing & Limits
            </h3>
            <p className="text-slate-500">
              Your Professional Plan is paid annually via commercial direct debit. Need additional terminal licenses or custom ERP connectors?
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 font-mono">
              <div className="flex justify-between">
                <span>Account ID:</span>
                <span className="font-bold">NX-PRO-849102</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Cycle:</span>
                <span>Annual (₹24,999/yr)</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span>Corporate Auto-Debit</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
