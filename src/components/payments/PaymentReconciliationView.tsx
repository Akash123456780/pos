import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowLeft, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Landmark,
  ShieldCheck,
  Building2,
  Clock,
  History,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonutChart } from '../common/Charts';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';
import { MOCK_BRANCHES } from '../../data/mockData';

export const PaymentReconciliationView: React.FC = () => {
  const { setSubView, showToast, activeBranchId, setActiveBranchId } = useApp();

  // Mode filters
  const [selectedShift, setSelectedShift] = useState<'morning' | 'evening' | 'fullday'>('morning');
  const [selectedBranch, setSelectedBranch] = useState<string>(activeBranchId === 'all' ? 'branch_1' : activeBranchId);

  // Daily Cash reconciliation numbers
  const [openingFloatInput, setOpeningFloatInput] = useState<string>('10000');
  const [cashSalesInput, setCashSalesInput] = useState<string>('18500');
  const [cashRefundsInput, setCashRefundsInput] = useState<string>('0');
  const [cashExpensesInput, setCashExpensesInput] = useState<string>('500');
  const [actualCashInput, setActualCashInput] = useState<string>('27950');
  const [varianceNote, setVarianceNote] = useState<string>('-₹50 minor customer coin rounding / petty cash variance');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Parse math values
  const openingFloat = parseFloat(openingFloatInput) || 0;
  const cashSales = parseFloat(cashSalesInput) || 0;
  const cashRefunds = parseFloat(cashRefundsInput) || 0;
  const cashExpenses = parseFloat(cashExpensesInput) || 0;
  const expectedCash = openingFloat + cashSales - cashRefunds - cashExpenses;
  const actualCash = parseFloat(actualCashInput) || 0;
  const variance = actualCash - expectedCash;

  // Tender Collections: Cash, UPI, Card, Credit, Other
  const collections = {
    cash: 18500,
    upi: 21350,
    card: 7800,
    credit: 1000,
    other: 0,
    total: 48650,
  };

  const donutItems = [
    { label: 'UPI (QR & Apps)', value: collections.upi, color: '#10b981' },
    { label: 'Physical Cash', value: collections.cash, color: '#3b82f6' },
    { label: 'Card Swipes', value: collections.card, color: '#8b5cf6' },
    { label: 'Store Credit (Khata)', value: collections.credit, color: '#f59e0b' },
    { label: 'Other / Cheque', value: collections.other, color: '#64748b' },
  ];

  // Reconciliation History
  const [historyRecords] = useState([
    {
      id: 'rec_101',
      date: '2026-10-05',
      shift: 'Evening Shift',
      branch: 'Main Branch',
      cashier: 'Priya Jadhav',
      openingFloat: 10000,
      cashSales: 22400,
      cashRefunds: 200,
      cashExpenses: 400,
      expectedCash: 31800,
      actualCash: 31800,
      variance: 0,
      status: 'MATCHED',
      note: 'Perfect till balance verified',
    },
    {
      id: 'rec_100',
      date: '2026-10-05',
      shift: 'Morning Shift',
      branch: 'Main Branch',
      cashier: 'Ramesh Pawar',
      openingFloat: 10000,
      cashSales: 16800,
      cashRefunds: 0,
      cashExpenses: 650,
      expectedCash: 26150,
      actualCash: 26130,
      variance: -20,
      status: 'MINOR_VARIANCE',
      note: '₹20 coin change deficit',
    },
    {
      id: 'rec_099',
      date: '2026-10-04',
      shift: 'Full Day',
      branch: 'City Center',
      cashier: 'Anand Shinde',
      openingFloat: 8000,
      cashSales: 19400,
      cashRefunds: 350,
      cashExpenses: 800,
      expectedCash: 26250,
      actualCash: 26250,
      variance: 0,
      status: 'MATCHED',
      note: 'Verified by manager',
    },
    {
      id: 'rec_098',
      date: '2026-10-04',
      shift: 'Full Day',
      branch: 'Market Yard',
      cashier: 'Sunil Gaikwad',
      openingFloat: 5000,
      cashSales: 14200,
      cashRefunds: 0,
      cashExpenses: 300,
      expectedCash: 18900,
      actualCash: 18950,
      variance: 50,
      status: 'SURPLUS',
      note: '₹50 uncollected customer change surplus',
    },
  ]);

  const handleSaveReconciliation = () => {
    setIsSaved(true);
    showToast({
      type: 'success',
      title: 'Daily Register Reconciled',
      message: `Cash count verified. Expected: ${formatINR(expectedCash)}, Actual: ${formatINR(actualCash)}, Variance: ${formatINR(variance)}.`,
    });
  };

  const handleExportHistory = () => {
    const headers = ['Date', 'Shift', 'Branch', 'Cashier', 'Opening Float', 'Cash Sales', 'Cash Refunds', 'Expenses', 'Expected', 'Actual', 'Variance', 'Status', 'Notes'];
    const rows = historyRecords.map(r => [
      r.date,
      r.shift,
      r.branch,
      r.cashier,
      r.openingFloat,
      r.cashSales,
      r.cashRefunds,
      r.cashExpenses,
      r.expectedCash,
      r.actualCash,
      r.variance,
      r.status,
      r.note
    ]);
    downloadCSV('NEXUS_Cash_Reconciliation_History', headers, rows);
    showToast({
      type: 'success',
      title: 'History Exported',
      message: 'Downloaded register reconciliation audit ledger as CSV.',
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
              Payment & Cash Reconciliation
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daily drawer float audit, tender channel settlement & shift-wise variance tracking
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Audit History</span>
        </button>
      </div>

      {/* 5 TENDER CHANNEL CARDS: Cash, UPI, Card, Credit, Other */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Cash */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider font-mono block">Cash</span>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(collections.cash)}
          </div>
          <span className="text-[10px] text-blue-600 font-medium">Physical till count</span>
        </div>

        {/* UPI */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider font-mono block">UPI</span>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(collections.upi)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">QR & NetBanking</span>
        </div>

        {/* Card */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider font-mono block">Card</span>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(collections.card)}
          </div>
          <span className="text-[10px] text-purple-600 font-medium">POS EDC terminal</span>
        </div>

        {/* Credit */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider font-mono block">Credit</span>
          <div className="text-lg sm:text-xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
            {formatINR(collections.credit)}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Customer Khata</span>
        </div>

        {/* Other */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Other</span>
          <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(collections.other)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Cheque / Voucher</span>
        </div>
      </div>

      {/* FILTER BAR: Shift-wise & Branch-wise */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Shift-wise Selector */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Shift:</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'morning', label: 'Morning Shift' },
              { id: 'evening', label: 'Evening Shift' },
              { id: 'fullday', label: 'Full Day Aggregate' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedShift(s.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedShift === s.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Branch-wise Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Branch:</span>
          <select
            value={selectedBranch}
            onChange={e => {
              setSelectedBranch(e.target.value);
              setActiveBranchId(e.target.value as any);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Store Branches</option>
            {MOCK_BRANCHES.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.shortCode})</option>
            ))}
          </select>
        </div>
      </div>

      {/* DAILY CASH RECONCILIATION WATERFALL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Daily Physical Cash Drawer Waterfall
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Opening Float + Cash Sales - Cash Refunds - Cash Expenses = Expected Cash
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold self-start sm:self-auto border border-blue-200 dark:border-blue-900/40">
            {selectedShift === 'morning' ? 'Morning Shift (Active)' : selectedShift === 'evening' ? 'Evening Shift' : 'Full Day'}
          </span>
        </div>

        {/* 6-STEP WATERFALL GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {/* 1. Opening Float */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase block">1. Opening Float</span>
            <input
              type="number"
              value={openingFloatInput}
              onChange={e => setOpeningFloatInput(e.target.value)}
              className="w-full mt-1 bg-transparent font-black text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">Till float reserve</span>
          </div>

          {/* 2. Cash Sales */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-emerald-600 text-[10px] uppercase font-bold block">+ 2. Cash Sales</span>
            <input
              type="number"
              value={cashSalesInput}
              onChange={e => setCashSalesInput(e.target.value)}
              className="w-full mt-1 bg-transparent font-black text-sm sm:text-base text-emerald-600 focus:outline-none"
            />
            <span className="text-[10px] text-emerald-600/80 block mt-0.5">Terminal bills</span>
          </div>

          {/* 3. Cash Refunds */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-rose-500 text-[10px] uppercase font-bold block">- 3. Cash Refunds</span>
            <input
              type="number"
              value={cashRefundsInput}
              onChange={e => setCashRefundsInput(e.target.value)}
              className="w-full mt-1 bg-transparent font-black text-sm sm:text-base text-rose-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">Customer returns</span>
          </div>

          {/* 4. Cash Expenses */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-rose-600 text-[10px] uppercase font-bold block">- 4. Cash Expenses</span>
            <input
              type="number"
              value={cashExpensesInput}
              onChange={e => setCashExpensesInput(e.target.value)}
              className="w-full mt-1 bg-transparent font-black text-sm sm:text-base text-rose-600 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">Voucher payouts</span>
          </div>

          {/* 5. Expected Cash */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 rounded-xl">
            <span className="text-blue-700 dark:text-blue-300 text-[10px] uppercase font-bold block">= 5. Expected Cash</span>
            <div className="text-sm sm:text-base font-black text-blue-700 dark:text-blue-300 mt-1">
              {formatINR(expectedCash)}
            </div>
            <span className="text-[10px] text-blue-600/80 block mt-0.5 font-sans">System computed</span>
          </div>

          {/* 6. Actual Cash */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
            <span className="text-emerald-700 dark:text-emerald-300 text-[10px] uppercase font-bold block">6. Actual Cash</span>
            <input
              type="number"
              value={actualCashInput}
              onChange={e => setActualCashInput(e.target.value)}
              className="w-full mt-1 bg-transparent font-black text-sm sm:text-base text-emerald-700 dark:text-emerald-300 focus:outline-none"
            />
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-sans">Physical count</span>
          </div>
        </div>

        {/* VARIANCE PROMINENT HIGHLIGHT */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          variance === 0 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-900 dark:text-emerald-200' 
            : variance > 0
              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500/40 text-blue-900 dark:text-blue-200'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/40 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                variance === 0 
                  ? 'bg-emerald-600 text-white' 
                  : variance > 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-rose-600 text-white'
              }`}>
                {variance === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs uppercase font-mono font-bold tracking-wider">
                  Reconciliation Status & Variance
                </div>
                <div className="text-lg sm:text-xl font-black font-mono mt-0.5">
                  {variance === 0 ? 'Exact Match (₹0 Variance)' : `Variance: ${variance > 0 ? '+' : ''}${formatINR(variance)}`}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono text-xs">
              <div className="font-bold">
                {variance === 0 ? 'Drawer Balanced' : variance > 0 ? 'Surplus in Till' : 'Deficit / Shortage in Till'}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">
                Expected: {formatINR(expectedCash)} · Actual: {formatINR(actualCash)}
              </div>
            </div>
          </div>

          {/* Variance note input */}
          <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-semibold block mb-1">
                Cashier / Owner Audit Justification:
              </label>
              <input
                type="text"
                value={varianceNote}
                onChange={e => setVarianceNote(e.target.value)}
                placeholder="Enter explanation for variance (e.g. coin round-off, customer refund)..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveReconciliation}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 self-end sm:self-auto transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isSaved ? 'Reconciled & Locked' : 'Confirm Cash Register'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* DONUT BREAKDOWN & RECONCILIATION HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DONUT BREAKDOWN */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">
            Tender Distribution
          </div>
          <DonutChart items={donutItems} centerLabel="Total" />
          <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>UPI Digital (QR):</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatINR(collections.upi)} (43.9%)</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Physical Cash:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatINR(collections.cash)} (38.0%)</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Card Swipes:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatINR(collections.card)} (16.0%)</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Store Credit:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatINR(collections.credit)} (2.1%)</span>
            </div>
          </div>
        </div>

        {/* RECONCILIATION HISTORY LEDGER */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Reconciliation Audit History
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Last 4 Shift Verifications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Date / Shift</th>
                  <th className="py-2.5 px-2">Branch & Cashier</th>
                  <th className="py-2.5 px-2 text-right">Expected</th>
                  <th className="py-2.5 px-2 text-right">Actual</th>
                  <th className="py-2.5 px-2 text-right">Variance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{rec.date}</div>
                      <div className="text-[10px] text-slate-400">{rec.shift}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{rec.branch}</div>
                      <div className="text-[10px] text-slate-400">{rec.cashier}</div>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-600 dark:text-slate-400">
                      {formatINR(rec.expectedCash)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white">
                      {formatINR(rec.actualCash)}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`font-bold ${
                        rec.variance === 0 
                          ? 'text-emerald-600' 
                          : rec.variance > 0 
                            ? 'text-blue-600' 
                            : 'text-rose-600'
                      }`}>
                        {rec.variance === 0 ? '₹0' : (rec.variance > 0 ? `+${formatINR(rec.variance)}` : formatINR(rec.variance))}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.variance === 0 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' 
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                      }`}>
                        {rec.variance === 0 ? 'MATCHED' : 'VARIANCE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
