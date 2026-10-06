import React from 'react';
import { 
  Users, 
  Truck, 
  UserCheck, 
  CreditCard, 
  Building2, 
  MonitorDot, 
  HeartPulse, 
  FileSpreadsheet, 
  Bell, 
  Shield, 
  Sparkles, 
  Settings, 
  User, 
  ChevronRight, 
  LogOut,
  Receipt,
  Layers,
  BarChart3
} from 'lucide-react';
import { useApp, SubViewType, ActiveTabType } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const MoreHubModal: React.FC = () => {
  const { setSubView, setActiveTab } = useApp();
  const { logout, user } = useAuth();

  const handleOpen = (sub: SubViewType, tab?: ActiveTabType) => {
    if (tab) setActiveTab(tab);
    setSubView(sub);
  };

  const menuSections = [
    {
      title: 'Store Operations',
      items: [
        { id: 'bills', label: 'Recent Bills & Invoices', sub: 'Audit slips & cancellations', icon: <Receipt className="w-5 h-5 text-emerald-500" /> },
        { id: 'expenses', label: 'Daily Store Expenses', sub: 'Cash vouchers & utilities', icon: <CreditCard className="w-5 h-5 text-blue-500" /> },
        { id: 'payments', label: 'Payments & Cash Till', sub: 'Tender reconciliation & float', icon: <CreditCard className="w-5 h-5 text-purple-500" /> },
        { id: 'health', label: 'Business Health Diagnostics', sub: 'Overall score 89/100', icon: <HeartPulse className="w-5 h-5 text-rose-500" /> },
      ],
    },
    {
      title: 'Directory & Partners',
      items: [
        { id: 'customers', label: 'Customers & Khata', sub: 'Credit ledger & loyalty points', icon: <Users className="w-5 h-5 text-indigo-500" /> },
        { id: 'suppliers', label: 'Suppliers & Purchases', sub: 'Trade payables & vendor POs', icon: <Truck className="w-5 h-5 text-teal-500" /> },
        { id: 'staff', label: 'Staff & Cashier Shifts', sub: 'Live logins & shift collections', icon: <UserCheck className="w-5 h-5 text-amber-500" /> },
      ],
    },
    {
      title: 'Network & Hardware',
      items: [
        { id: 'branches', label: 'Multi-Branch Overview', sub: 'Main, City, Market outlets', icon: <Building2 className="w-5 h-5 text-sky-500" /> },
        { id: 'pos', label: 'POS Terminal Fleet', sub: 'Printer, scanner & sync state', icon: <MonitorDot className="w-5 h-5 text-slate-500" /> },
      ],
    },
    {
      title: 'Taxes & Reports',
      items: [
        { id: 'gst', label: 'GST Tax Summary', sub: 'GSTR-3B estimates & HSN slabs', icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> },
        { id: 'profitLoss', label: 'Profit & Loss (P&L)', sub: 'COGS waterfall & net margin', icon: <BarChart3 className="w-5 h-5 text-blue-600" /> },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { id: 'professional-plan', label: 'NEXUS Professional Plan', sub: 'Licenses & active quotas', icon: <Sparkles className="w-5 h-5 text-emerald-500" /> },
        { id: 'security', label: 'Security Center', sub: 'PIN, biometrics & sessions', icon: <Shield className="w-5 h-5 text-blue-500" /> },
        { id: 'notifications', label: 'Notifications Center', sub: 'Alert history & audit flags', icon: <Bell className="w-5 h-5 text-amber-500" /> },
        { id: 'settings', label: 'Store Preferences', sub: 'Language, theme & currency', icon: <Settings className="w-5 h-5 text-slate-500" /> },
        { id: 'profile', label: 'Owner Account', sub: `${user?.name || BUSINESS_INFO.ownerName}`, icon: <User className="w-5 h-5 text-slate-700 dark:text-slate-300" /> },
      ],
    },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-2xl mx-auto pb-20">
      
      {/* Header Profile Tile */}
      <div 
        onClick={() => handleOpen('profile')}
        className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 dark:bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
            RS
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {user?.name || BUSINESS_INFO.ownerName}
            </div>
            <div className="text-xs text-slate-500">
              {BUSINESS_INFO.name} · {BUSINESS_INFO.planName}
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>

      {/* Grouped Modules */}
      {menuSections.map((sec, idx) => (
        <div key={idx} className="space-y-2">
          <div className="text-[11px] font-mono uppercase font-bold text-slate-400 px-1">
            {sec.title}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {sec.items.map(item => (
              <div
                key={item.id}
                onClick={() => handleOpen(item.id as SubViewType)}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.sub}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Owner App</span>
        </button>
      </div>

    </div>
  );
};
