import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  Boxes, 
  AlertTriangle, 
  ArrowRight, 
  IndianRupee, 
  Clock, 
  Users, 
  CheckCircle2, 
  Truck, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Zap,
  Activity,
  HeartPulse,
  MonitorDot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { dashboardApi, billsApi, staffApi } from '../../api';
import { KpiCard } from '../common/KpiCard';
import { AreaChart, DonutChart } from '../common/Charts';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR, getGreeting } from '../../utils/formatters';
import { DashboardMetrics, Bill, StaffMember } from '../../types';
import { BUSINESS_INFO, MOCK_HOURLY_SALES } from '../../data/mockData';

export const TodaySummary: React.FC = () => {
  const { 
    activeBranchId, 
    setActiveTab, 
    setSubView, 
    setSelectedBill, 
    setSelectedProduct 
  } = useApp();
  
  const { user } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [dashMetrics, bills, staff] = await Promise.all([
          dashboardApi.getDashboardMetrics(activeBranchId),
          billsApi.getBills({ branchId: activeBranchId }),
          staffApi.getStaff(activeBranchId),
        ]);
        if (isMounted) {
          setMetrics(dashMetrics);
          setRecentBills(bills.slice(0, 5));
          setStaffList(staff);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activeBranchId]);

  if (isLoading || !metrics) {
    return (
      <div className="p-3 sm:p-6 space-y-4 max-w-7xl mx-auto">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const chartData = MOCK_HOURLY_SALES.map(item => ({
    label: item.hour,
    value: item.sales,
  }));

  const paymentDonutItems = [
    { label: 'UPI', value: metrics.upiCollection, color: '#10b981' },
    { label: 'Cash', value: metrics.cashCollection, color: '#3b82f6' },
    { label: 'Card', value: metrics.cardCollection, color: '#8b5cf6' },
    { label: 'Credit', value: metrics.creditSales, color: '#f59e0b' },
  ];

  // Active cashier count
  const onlineCashiers = staffList.filter(s => s.status === 'ONLINE' && s.role === 'Cashier');

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      
      {/* 1. STORE OVERVIEW BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              {getGreeting()}, Owner
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live POS Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Store: <span className="font-bold text-slate-800 dark:text-slate-200">{BUSINESS_INFO.name}</span> · {BUSINESS_INFO.planName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubView('health')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Health Score: 89 / 100</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 PRIORITY CARDS: SALES, PROFIT, BILLS, EXPENSES */}
      <div>
        <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2.5 tracking-wider px-0.5">
          Executive Snapshot (Today)
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Today's Sales */}
          <KpiCard
            title={t('todaySales')}
            value={metrics.todaySales.formattedValue}
            diffPercent={metrics.todaySales.diffPercent}
            diffLabel={t('vsYesterday')}
            isPositive={metrics.todaySales.isPositive}
            sparklineData={[38000, 42000, 41500, 44000, 48650]}
            icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
            onClick={() => setActiveTab('sales')}
          />

          {/* Card 2: Today's Profit */}
          <KpiCard
            title={t('todayProfit')}
            value={metrics.todayProfit.formattedValue}
            diffPercent={metrics.todayProfit.diffPercent}
            diffLabel={t('vsYesterday')}
            isPositive={metrics.todayProfit.isPositive}
            sparklineData={[7500, 8200, 8600, 9100, 9840]}
            icon={<IndianRupee className="w-4 h-4 text-emerald-600" />}
            onClick={() => { setActiveTab('sales'); setSubView('profitLoss'); }}
          />

          {/* Card 3: Today's Bills */}
          <KpiCard
            title={t('todayBills')}
            value={metrics.todayBills.formattedValue}
            diffPercent={metrics.todayBills.diffPercent}
            diffLabel={t('vsYesterday')}
            isPositive={metrics.todayBills.isPositive}
            sparklineData={[98, 105, 112, 118, 126]}
            icon={<Receipt className="w-4 h-4 text-blue-600" />}
            onClick={() => setSubView('bills')}
          />

          {/* Card 4: Today's Expenses */}
          <KpiCard
            title={t('todayExpenses')}
            value={metrics.todayExpenses.formattedValue}
            diffPercent={metrics.todayExpenses.diffPercent}
            diffLabel={t('vsYesterday')}
            isPositive={metrics.todayExpenses.isPositive} // lower expense is positive
            sparklineData={[4800, 4600, 4500, 4380, 4250]}
            icon={<CreditCard className="w-4 h-4 text-rose-500" />}
            onClick={() => setSubView('expenses')}
          />

        </div>
      </div>

      {/* 3. COLLECTIONS ROW: CASH, UPI, CARD, CREDIT */}
      <div>
        <div className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2.5 tracking-wider px-0.5">
          Tender Collections & Receivables
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          
          <div 
            onClick={() => setSubView('payments')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('cashCollection')}</div>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
              {formatINR(metrics.cashCollection)}
            </div>
            <div className="text-[11px] text-blue-600 font-mono mt-0.5">38.0% of total till</div>
          </div>

          <div 
            onClick={() => setSubView('payments')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('upiCollection')}</div>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
              {formatINR(metrics.upiCollection)}
            </div>
            <div className="text-[11px] text-emerald-600 font-mono mt-0.5">43.9% QR & apps</div>
          </div>

          <div 
            onClick={() => setSubView('payments')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('cardCollection')}</div>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">
              {formatINR(metrics.cardCollection)}
            </div>
            <div className="text-[11px] text-purple-600 font-mono mt-0.5">16.0% POS swipes</div>
          </div>

          <div 
            onClick={() => setSubView('customers')}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('creditSales')}</div>
            <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
              {formatINR(metrics.creditSales)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Store Khata ledger</div>
          </div>

        </div>
      </div>

      {/* 4. SALES TREND (HOURLY VELOCITY AREA CHART) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
              Sales Trend (Hourly Velocity)
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Live Checkout Turnover Profile
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Peak Velocity: 12:00 PM (₹11,200)</span>
          </div>
        </div>

        <AreaChart data={chartData} height={190} color="#10b981" />
      </div>

      {/* 5. INVENTORY ALERTS (HIGH VISIBILITY SECTION) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Inventory Alerts
              </h2>
              <p className="text-[11px] text-slate-400">
                Critical replenishment required across store departments
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t('reviewStock')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Alert 1 */}
          <div 
            onClick={() => setActiveTab('inventory')}
            className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400">Buffer Alert</span>
              <span className="text-xs font-black font-mono text-amber-700 dark:text-amber-400">17 Items</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              Below Minimum Stock
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Atta, Sunflower Oil & Parle-G need reorder
            </div>
          </div>

          {/* Alert 2 */}
          <div 
            onClick={() => setActiveTab('inventory')}
            className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 rounded-xl cursor-pointer hover:border-rose-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-700 dark:text-rose-400">Stockout Alert</span>
              <span className="text-xs font-black font-mono text-rose-700 dark:text-rose-400">4 Items</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              Zero Stock Depleted
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Dove Soap 4pk & boAt Airdopes
            </div>
          </div>

          {/* Alert 3 */}
          <div 
            onClick={() => setActiveTab('inventory')}
            className="p-3 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/50 rounded-xl cursor-pointer hover:border-orange-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-orange-700 dark:text-orange-400">Expiry Alert</span>
              <span className="text-xs font-black font-mono text-orange-700 dark:text-orange-400">8 Batches</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
              Expiring Within 30 Days
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Amul Milk 1L batch expires in 19 days
            </div>
          </div>
        </div>
      </div>

      {/* 6. STAFF ACTIVITY (LIVE SHIFT OCCUPANCY) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('staffActivity')}
              </h2>
              <p className="text-[11px] text-slate-400">
                {onlineCashiers.length} Cashiers Online · Zero drawer voids reported
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubView('staff')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Shifts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-slate-400 text-[10px] uppercase font-sans">Top Cashier Today</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-sans">
              Ramesh Gowda (Main)
            </div>
            <div className="text-emerald-600 text-[11px] font-bold mt-1">
              54 Bills · {formatINR(20400)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-slate-400 text-[10px] uppercase font-sans">City Counter</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-sans">
              Anitha Krishna
            </div>
            <div className="text-emerald-600 text-[11px] font-bold mt-1">
              36 Bills · {formatINR(13900)}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-slate-400 text-[10px] uppercase font-sans">Discounts Authorized</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-sans">
              Manual Deductions
            </div>
            <div className="text-amber-600 text-[11px] font-bold mt-1">
              3 Bills · {formatINR(320)}
            </div>
          </div>
        </div>
      </div>

      {/* 7. BUSINESS HEALTH DIAGNOSTIC CARD */}
      <div 
        onClick={() => setSubView('health')}
        className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white rounded-2xl cursor-pointer hover:border-slate-700 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">Business Health Diagnostic</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                89 / 100
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              &quot;Sales velocity is +12.4% higher than yesterday. Reorder buffer stock for 17 grocery items to protect weekend volume.&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 self-end sm:self-auto flex-shrink-0">
          <span>Inspect Health</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 8. RECENT BILLS TICKER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
              Real-Time Invoices
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {t('recentBills')}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubView('bills')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')} ({metrics.todayBills.value})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentBills.map(bill => (
            <div
              key={bill.id}
              onClick={() => setSelectedBill(bill)}
              className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {bill.billNumber}
                  </span>
                  <StatusBadge status={bill.status} size="sm" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {bill.customerName} · {bill.cashierName} · {bill.time}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(bill.grandTotal)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {bill.paymentMode}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
