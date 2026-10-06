import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft, 
  FileDown, 
  Receipt, 
  Check, 
  Paperclip,
  Calendar,
  IndianRupee,
  Building,
  Upload,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { expenseApi } from '../../api';
import { Expense, ExpenseCategory } from '../../types';
import { FilterChips } from '../common/FilterChips';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';
import { BUSINESS_INFO, MOCK_BRANCHES, MOCK_DASHBOARD_METRICS } from '../../data/mockData';

export const ExpenseListView: React.FC = () => {
  const { activeBranchId, setSubView, showToast } = useApp();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New expense form state
  const [category, setCategory] = useState<ExpenseCategory>('Transport');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('CASH');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [hasAttachment, setHasAttachment] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchExpenses() {
      setIsLoading(true);
      try {
        const data = await expenseApi.getExpenses(activeBranchId);
        if (isMounted) setExpenses(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchExpenses();
    return () => { isMounted = false; };
  }, [activeBranchId]);

  // Categories required: Rent, Salary, Electricity, Transport, Maintenance, Marketing, Office, Other
  const categoriesList: ExpenseCategory[] = [
    'Rent',
    'Salary',
    'Electricity',
    'Transport',
    'Maintenance',
    'Marketing',
    'Office',
    'Other'
  ];

  const categoryChips = [
    { id: 'ALL', label: 'All Categories' },
    ...categoriesList.map(c => ({ id: c, label: c }))
  ];

  // Dynamic Metrics Calculation
  const todayStr = '2026-10-06';
  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonthTotal = expenses.reduce((sum, e) => sum + e.amount, 0) + 70000; // MTD aggregate with overhead
  const cashExpensesTotal = expenses.filter(e => e.paymentMode === 'CASH').reduce((sum, e) => sum + e.amount, 0);
  const bankUpiExpensesTotal = expenses.filter(e => e.paymentMode === 'UPI' || e.paymentMode === 'BANK_TRANSFER').reduce((sum, e) => sum + e.amount, 0);

  // Filtered expenses list
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.addedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || isNaN(num) || num <= 0) return;

    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const memo = reference.trim() ? `${description.trim()} (Ref: ${reference.trim()})` : description.trim();

      const created = await expenseApi.addExpense({
        branchId: activeBranchId === 'all' ? 'branch_1' : activeBranchId,
        branchName: activeBranchId === 'all' ? 'NEXUS Mart - Main' : MOCK_BRANCHES.find(b => b.id === activeBranchId)?.name || 'Store',
        date: date || now.toISOString().split('T')[0],
        time: timeStr,
        category,
        description: memo,
        amount: num,
        addedBy: `${BUSINESS_INFO.ownerName} (Owner)`,
        paymentMode,
        status: 'APPROVED',
        receiptAttached: hasAttachment,
      });

      // Update local expenses list
      setExpenses(prev => [created, ...prev]);

      // Update dashboard expense totals
      MOCK_DASHBOARD_METRICS.todayExpenses.value += num;
      MOCK_DASHBOARD_METRICS.todayExpenses.formattedValue = `₹${MOCK_DASHBOARD_METRICS.todayExpenses.value.toLocaleString('en-IN')}`;

      // Reset modal form
      setIsAddModalOpen(false);
      setDescription('');
      setAmount('');
      setReference('');
      setCategory('Transport');
      setPaymentMode('CASH');
      setDate(new Date().toISOString().split('T')[0]);

      showToast({
        type: 'success',
        title: 'Expense Voucher Recorded',
        message: `${formatINR(num)} logged under ${category}. Dashboard updated.`,
      });
    } catch {
      showToast({ type: 'error', title: 'Failed to record expense' });
    }
  };

  const handleExport = () => {
    const headers = ['Date', 'Time', 'Branch', 'Category', 'Description', 'Amount', 'Payment Mode', 'Added By'];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.time,
      e.branchName,
      e.category,
      e.description,
      e.amount,
      e.paymentMode,
      e.addedBy
    ]);
    downloadCSV('NEXUS_Store_Expenses', headers, rows);
    showToast({
      type: 'success',
      title: 'Expenses Exported',
      message: 'Downloaded CSV record of store vouchers.',
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
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
              Daily Store Expenses
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cash vouchers, store utility overheads, rentals & operational outflow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 REQUIRED METRICS: Today's Expenses, This Month, Cash Expenses, Bank/UPI Expenses */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Today&apos;s Expenses</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(todayTotal)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            {todayExpenses.length} vouchers logged today
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">This Month</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(thisMonthTotal)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            MTD rent & operational total
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider font-mono">Cash Expenses</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {formatINR(cashExpensesTotal)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            Drawer float disbursements
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-purple-600 uppercase tracking-wider font-mono">Bank/UPI Expenses</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
            {formatINR(bankUpiExpensesTotal)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            Digital RTGS & UPI transfers
          </span>
        </div>
      </div>

      {/* SEARCH AND CATEGORY FILTER CHIPS */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search expenses by description, vendor, mode, or category..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <FilterChips
          options={categoryChips}
          selected={selectedCategory}
          onChange={id => setSelectedCategory(id)}
        />
      </div>

      {/* EXPENSES LIST: Date, Category, Description, Amount, Payment Mode, Added By */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No expenses found matching current filters.
          </div>
        ) : (
          filteredExpenses.map(exp => (
            <div key={exp.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {exp.category}
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                    {exp.paymentMode}
                  </span>
                  {exp.receiptAttached && (
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-mono">
                      <Paperclip className="w-3 h-3" />
                      Receipt Attached
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-200 mt-1 font-medium">
                  {exp.description}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5 font-mono flex flex-wrap items-center gap-x-2">
                  <span>Date: <strong className="text-slate-600 dark:text-slate-300 font-semibold">{exp.date}</strong></span>
                  <span>·</span>
                  <span>Time: {exp.time}</span>
                  <span>·</span>
                  <span>Branch: {exp.branchName}</span>
                  <span>·</span>
                  <span>Added By: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{exp.addedBy}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="text-left sm:text-right">
                  <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                    {formatINR(exp.amount)}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                    {exp.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Store Expense Voucher
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Rent">Rent</option>
                  <option value="Salary">Salary</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Transport">Transport</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm font-bold"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CASH', 'UPI', 'BANK_TRANSFER'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`py-2 rounded-xl font-medium text-[11px] font-mono ${
                        paymentMode === m
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m === 'BANK_TRANSFER' ? 'Bank Transfer' : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generator diesel refill for load shedding"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Reference */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Reference / Bill No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. PETROL-PUMP-INV-9921"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              {/* Attachment Placeholder */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Bill / Voucher Attachment</label>
                <div 
                  onClick={() => setHasAttachment(!hasAttachment)}
                  className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {hasAttachment ? 'Voucher_Receipt_Scanned.pdf' : 'Attach physical bill receipt'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {hasAttachment ? 'Verified & attached to voucher' : 'Click to attach image / camera snap'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${hasAttachment ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                    {hasAttachment ? 'Attached' : 'Optional'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-colors"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
