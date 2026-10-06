import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Boxes, 
  BarChart3, 
  Grid3X3,
  Receipt,
  Users,
  Truck,
  UserCheck,
  CreditCard,
  Building2,
  MonitorDot,
  HeartPulse,
  Bell,
  Shield,
  Settings,
  Sparkles,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';
import { useApp, ActiveTabType, SubViewType } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BUSINESS_INFO } from '../../data/mockData';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, subView, setSubView } = useApp();
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const handleTabClick = (tab: ActiveTabType) => {
    setActiveTab(tab);
    setSubView('none');
  };

  const handleSidebarItemClick = (tab: ActiveTabType, sub: SubViewType = 'none') => {
    setActiveTab(tab);
    setSubView(sub);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Phones < 768px)                */}
      {/* ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="grid grid-cols-5 h-14">
          
          {/* 1. HOME */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'home' && subView === 'none'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">{t('navHome')}</span>
          </button>

          {/* 2. SALES */}
          <button
            type="button"
            onClick={() => handleTabClick('sales')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'sales' && subView === 'none'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">{t('navSales')}</span>
          </button>

          {/* 3. INVENTORY */}
          <button
            type="button"
            onClick={() => handleTabClick('inventory')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'inventory' && subView === 'none'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">{t('navInventory')}</span>
          </button>

          {/* 4. REPORTS */}
          <button
            type="button"
            onClick={() => handleTabClick('reports')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'reports' && subView === 'none'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">{t('navReports')}</span>
          </button>

          {/* 5. MORE (Hub) */}
          <button
            type="button"
            onClick={() => handleTabClick('more')}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              activeTab === 'more' || subView !== 'none'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Grid3X3 className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] tracking-tight">{t('navMore')}</span>
          </button>

        </div>
      </nav>

      {/* ============================================================ */}
      {/* DESKTOP / TABLET SIDEBAR (Screen >= 768px)                    */}
      {/* ============================================================ */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 overflow-y-auto z-40 select-none">
        
        {/* Brand Top Tile */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black tracking-wider text-base shadow-sm">
              NX
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                NEXUS OWNER
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {BUSINESS_INFO.name}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{BUSINESS_INFO.planName}</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-600">Active</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-4 space-y-6 text-xs">
          
          {/* SECTION 1: CORE */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Core Operations
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSidebarItemClick('home', 'none')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'home' && subView === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('sales', 'none')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'sales' && subView === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Sales Analytics</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('sales', 'profitLoss')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'profitLoss'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Profit & Loss (P&L)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('home', 'bills')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'bills'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Recent Bills & Invoices</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: INVENTORY & COMMERCE */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Inventory & Supply
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSidebarItemClick('inventory', 'none')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'inventory' && subView === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Stock & Inventory</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'suppliers')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'suppliers'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Suppliers & Purchases</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'expenses')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'expenses'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Daily Expenses</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'payments')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'payments'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payments & Cash Register</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: PEOPLE & BRANCHES */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Entities & Network
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'customers')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'customers'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers & Khata</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'staff')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'staff'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Staff & Cashier Shifts</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'branches')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'branches'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Multi-Branch Monitor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'pos')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'pos'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MonitorDot className="w-4 h-4" />
                <span>POS Device Fleet</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: INTELLIGENCE & REPORTS */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Intelligence & Compliance
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'health')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'health'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <HeartPulse className="w-4 h-4 text-emerald-500" />
                <span>Business Health Score</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('reports', 'none')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'reports' && subView === 'none'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>All Store Reports</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('reports', 'gst')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'gst'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>GST Tax Summary</span>
              </button>
            </div>
          </div>

          {/* SECTION 5: ACCOUNT & SECURITY */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Admin & Security
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'notifications')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'notifications'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'security')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'security'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security Center</span>
              </button>

              <button
                type="button"
                onClick={() => handleSidebarItemClick('more', 'settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  subView === 'settings'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>
            </div>
          </div>

        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => handleSidebarItemClick('more', 'profile')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              RS
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || BUSINESS_INFO.ownerName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Owner Account
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign out from app"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>
    </>
  );
};
