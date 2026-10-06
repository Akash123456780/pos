import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  IndianRupee, 
  Tag, 
  Percent, 
  FileDown,
  ShoppingBag,
  Award,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FilterChips } from '../common/FilterChips';
import { KpiCard } from '../common/KpiCard';
import { AreaChart, BarChart } from '../common/Charts';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';
import { MOCK_DAILY_SALES_7D, MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../../data/mockData';

export const SalesAnalyticsView: React.FC = () => {
  const { dateFilter, setDateFilter, setSubView, setSelectedProduct, setSelectedCustomer } = useApp();
  const [metricTab, setMetricTab] = useState<'sales' | 'profit' | 'bills' | 'basket'>('sales');

  const filterOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
  ];

  const salesTrendData = MOCK_DAILY_SALES_7D.map(d => ({
    label: d.date,
    value: metricTab === 'sales' ? d.sales : metricTab === 'profit' ? d.profit : d.bills,
  }));

  const topCategories = [
    { name: 'Grocery & Staples', sales: 18450, share: 38 },
    { name: 'Edible Oils & Ghee', sales: 11200, share: 23 },
    { name: 'Snacks & Biscuits', sales: 7850, share: 16 },
    { name: 'Apparel & Clothing', sales: 6200, share: 13 },
    { name: 'Personal Care', sales: 4950, share: 10 },
  ];

  const handleExport = () => {
    const headers = ['Date', 'Gross Sales', 'Net Profit', 'Bills Count'];
    const rows = MOCK_DAILY_SALES_7D.map(d => [d.date, d.sales, d.profit, d.bills]);
    downloadCSV('NEXUS_Sales_Analytics', headers, rows);
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Sales Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time turnover trends, revenue velocity & product insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubView('profitLoss')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Switch to P&L View
          </button>
          
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter Chips */}
      <div>
        <FilterChips
          options={filterOptions}
          selected={dateFilter}
          onChange={(id: any) => setDateFilter(id)}
        />
      </div>

      {/* CORE FINANCIAL WATERFALL METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          title="Gross Sales"
          value={formatINR(49890)}
          subValue="Pre-discount billing"
          diffPercent={13.1}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KpiCard
          title="Discounts & Vouchers"
          value={formatINR(1240)}
          subValue="Promo & loyalty deductions"
          diffPercent={-4.2}
          isPositive={true}
          icon={<Tag className="w-4 h-4" />}
        />
        <KpiCard
          title="Net Sales (Revenue)"
          value={formatINR(48650)}
          subValue="Settled checkout revenue"
          diffPercent={12.4}
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <KpiCard
          title="Gross Profit"
          value={formatINR(9840)}
          subValue="20.2% Net margin"
          diffPercent={8.2}
          icon={<Percent className="w-4 h-4" />}
        />
      </div>

      {/* INTERACTIVE TREND GRAPH CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-slate-400">
              Velocity Timeline
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Multi-Day Performance Curve
            </div>
          </div>

          {/* Metric tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto font-medium">
            <button
              type="button"
              onClick={() => setMetricTab('sales')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                metricTab === 'sales' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              Sales (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetricTab('profit')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                metricTab === 'profit' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              Profit (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetricTab('bills')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                metricTab === 'bills' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              Bills Count
            </button>
          </div>
        </div>

        <AreaChart 
          data={salesTrendData} 
          height={200} 
          color={metricTab === 'sales' ? '#10b981' : metricTab === 'profit' ? '#3b82f6' : '#8b5cf6'}
          isCurrency={metricTab !== 'bills'}
        />
      </div>

      {/* TOP PERFORMERS: PRODUCTS, CATEGORIES, CUSTOMERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
              Top Selling Items
            </h3>
          </div>
          <div className="space-y-3">
            {MOCK_PRODUCTS.slice(0, 4).map((prod, idx) => (
              <div 
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 dark:text-white truncate">{prod.name}</div>
                    <div className="text-[10px] text-slate-400">{prod.brand} · Stock: {prod.currentStock}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-900 dark:text-white">{formatINR(prod.salePrice * 12)}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">12 units sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
              Department Contribution
            </h3>
          </div>
          <div className="space-y-3">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(cat.sales)} ({cat.share}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${cat.share}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Purchasing Customers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
              Top Loyal Patrons
            </h3>
          </div>
          <div className="space-y-3">
            {MOCK_CUSTOMERS.slice(0, 4).map((cust, idx) => (
              <div 
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 dark:text-white truncate">{cust.name}</div>
                  <div className="text-[10px] text-slate-400">{cust.segment} · {cust.totalOrders} visits</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-900 dark:text-white">{formatINR(cust.totalPurchases)}</div>
                  <div className="text-[10px] text-emerald-600 font-mono">{cust.loyaltyPoints} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
