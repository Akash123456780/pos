import React from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  ArrowLeft, 
  PieChart, 
  Percent, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AreaChart, BarChart } from '../common/Charts';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';
import { MOCK_MONTHLY_PL } from '../../data/mockData';

export const ProfitLossView: React.FC = () => {
  const { setSubView, setActiveTab } = useApp();

  const currentMonthData = {
    revenue: 1410000,
    cogs: 1080000,
    grossProfit: 330000,
    expenses: 132000,
    netProfit: 198000,
    marginPercent: 14.04,
  };

  const expenseBreakdown = [
    { category: 'Staff Salaries', amount: 68000, share: 51.5 },
    { category: 'Store Rent', amount: 45000, share: 34.1 },
    { category: 'Electricity & Utilities', amount: 8500, share: 6.4 },
    { category: 'Transport & Logistics', amount: 4200, share: 3.2 },
    { category: 'Maintenance & Repairs', amount: 3100, share: 2.3 },
    { category: 'Marketing & Local SMS', amount: 1800, share: 1.4 },
    { category: 'Office & Consumables', amount: 1400, share: 1.1 },
  ];

  const monthlyChartData = MOCK_MONTHLY_PL.map(m => ({
    label: m.month,
    value: m.netProfit,
  }));

  const handleExportPL = () => {
    const headers = ['Month', 'Gross Revenue', 'COGS', 'Operating Expenses', 'Net Profit'];
    const rows = MOCK_MONTHLY_PL.map(m => [m.month, m.revenue, m.cogs, m.expenses, m.netProfit]);
    downloadCSV('NEXUS_Profit_Loss_Statement', headers, rows);
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
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
              Profit & Loss Statement
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Net operating margins, COGS cost waterfall & operational bottom-line
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportPL}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export P&L Report</span>
        </button>
      </div>

      {/* P&L WATERFALL SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">1. Revenue</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(currentMonthData.revenue)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+8.4% vs last mo</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">2. Less: COGS</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(currentMonthData.cogs)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Inventory cost price</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">3. Gross Profit</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(currentMonthData.grossProfit)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">23.4% Gross margin</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">4. Less: Expenses</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(currentMonthData.expenses)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Rent, salaries, bills</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">5. Net Profit</span>
          <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-emerald-300 mt-1">
            {formatINR(currentMonthData.netProfit)}
          </div>
          <span className="text-[10px] font-bold text-emerald-600">Net Margin: {currentMonthData.marginPercent}%</span>
        </div>
      </div>

      {/* MONTHLY NET PROFIT GRAPH */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-slate-400">
              Net Profit Progression
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Monthly Net Earnings Trend
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600">
            Consecutive 5-Month Growth
          </span>
        </div>
        <AreaChart data={monthlyChartData} height={200} color="#10b981" />
      </div>

      {/* OPERATING EXPENSES BREAKDOWN TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase font-bold text-slate-400">
              Cost Allocation
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Monthly Operational Expenses Breakdown
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Total: {formatINR(currentMonthData.expenses)}
          </span>
        </div>

        <div className="space-y-3">
          {expenseBreakdown.map((exp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{exp.category}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatINR(exp.amount)} <span className="text-[11px] font-normal text-slate-400">({exp.share}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-700 dark:bg-slate-300 rounded-full" 
                  style={{ width: `${exp.share}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
