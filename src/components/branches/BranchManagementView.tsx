import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Boxes, 
  MonitorDot, 
  Check, 
  MapPin, 
  Phone,
  ArrowRight,
  Filter,
  DollarSign,
  Receipt,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_BRANCHES } from '../../data/mockData';
import { formatINR } from '../../utils/formatters';
import { BarChart } from '../common/Charts';
import { BranchId } from '../../types';

export const BranchManagementView: React.FC = () => {
  const { activeBranchId, setActiveBranchId, setSubView, setActiveTab, showToast } = useApp();

  // Filters: Today, 7 Days, 30 Days, This Month
  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '30d' | 'month'>('today');
  // Metric for comparison: Sales | Profit | Expenses | Bills | Average Bill Value
  const [comparisonMetric, setComparisonMetric] = useState<'sales' | 'profit' | 'expenses' | 'bills' | 'abv'>('sales');

  const filterMultipliers: Record<string, number> = {
    today: 1,
    '7d': 6.8,
    '30d': 28.5,
    month: 26.2,
  };
  const mult = filterMultipliers[timeFilter] || 1;

  const branchData = MOCK_BRANCHES.map(b => {
    const sales = Math.round(b.todaySales * mult);
    const profit = Math.round(b.todayProfit * mult);
    const expenses = Math.round(b.todaySales * 0.12 * mult);
    const bills = Math.round(b.todayBills * mult);
    const abv = bills > 0 ? Math.round(sales / bills) : 0;
    return {
      ...b,
      sales,
      profit,
      expenses,
      bills,
      abv,
      status: 'Active / Operational',
    };
  });

  const comparisonChartData = branchData.map(b => {
    let val = b.sales;
    if (comparisonMetric === 'profit') val = b.profit;
    else if (comparisonMetric === 'expenses') val = b.expenses;
    else if (comparisonMetric === 'bills') val = b.bills;
    else if (comparisonMetric === 'abv') val = b.abv;

    return {
      label: b.shortCode,
      value: val,
      subLabel: b.name,
    };
  });

  const handleSelectBranch = (id: BranchId) => {
    setActiveBranchId(id);
    const branchName = id === 'all' ? 'All Stores (Consolidated)' : MOCK_BRANCHES.find(b => b.id === id)?.name || id;
    showToast({
      type: 'success',
      title: 'Branch Active',
      message: `Active context switched to ${branchName}. Dashboard and reports updated.`,
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              Multi-Branch Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live store comparison, inventory valuation & cross-branch operational analytics
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSelectBranch('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeBranchId === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          {activeBranchId === 'all' ? '✓ Showing All Stores' : 'Aggregate All Stores'}
        </button>
      </div>

      {/* FILTER BAR: Today, 7 Days, 30 Days, This Month */}
      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Timeframe:</span>
          <div className="flex items-center gap-1">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'month', label: 'This Month' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeFilter === f.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* COMPARISON METRIC SELECTOR: Sales, Profit, Expenses, Bills, Average Bill Value */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono mr-1">Benchmark:</span>
          {[
            { id: 'sales', label: 'Sales' },
            { id: 'profit', label: 'Profit' },
            { id: 'expenses', label: 'Expenses' },
            { id: 'bills', label: 'Bills' },
            { id: 'abv', label: 'Avg Bill' },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setComparisonMetric(m.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono transition-colors ${
                comparisonMetric === m.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* BRANCH COMPARISON BENCHMARK CHART */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
              Cross-Branch Performance Comparison
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Comparing {comparisonMetric.toUpperCase()} across all 3 store branches ({timeFilter.toUpperCase()})
            </div>
          </div>
        </div>

        <BarChart 
          data={comparisonChartData} 
          height={160} 
          color={comparisonMetric === 'profit' ? '#10b981' : comparisonMetric === 'expenses' ? '#f43f5e' : '#3b82f6'} 
        />
      </div>

      {/* BRANCH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branchData.map(branch => {
          const isSelected = activeBranchId === branch.id;

          return (
            <div
              key={branch.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Card Header: Branch Name, Location, Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {branch.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      {branch.shortCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">{branch.address}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
                  {branch.status}
                </span>
              </div>

              {/* Metrics Grid: Today's Sales, Today's Profit, Expenses, Stock Value */}
              <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase">Sales</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                    {formatINR(branch.sales)}
                  </span>
                </div>
                <div>
                  <span className="text-emerald-600 text-[10px] block uppercase font-bold">Est. Profit</span>
                  <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                    {formatINR(branch.profit)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-rose-500 text-[10px] block uppercase font-bold">Expenses</span>
                  <span className="text-xs font-bold text-rose-600 block">
                    {formatINR(branch.expenses)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase">Stock Value</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {formatINR(branch.stockValue)}
                  </span>
                </div>
              </div>

              {/* Staff & POS Devices */}
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pb-3 font-mono">
                <div className="flex justify-between">
                  <span>Store Manager:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{branch.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Staff On Duty:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{branch.staffCount} Active Staff</span>
                </div>
                <div className="flex justify-between">
                  <span>POS Devices:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{branch.posCount} Terminals Active</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Average Bill Value:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(branch.abv)}</span>
                </div>
              </div>

              {/* Action Button: Selecting a branch updates relevant application data */}
              <button
                type="button"
                onClick={() => handleSelectBranch(branch.id as BranchId)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Currently Selected Branch</span>
                  </>
                ) : (
                  <>
                    <span>Switch to this Branch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
