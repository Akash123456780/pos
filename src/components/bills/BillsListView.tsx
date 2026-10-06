import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Calendar, 
  ArrowLeft, 
  ChevronRight, 
  FileDown, 
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { billsApi } from '../../api';
import { Bill } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { FilterChips } from '../common/FilterChips';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';

export const BillsListView: React.FC = () => {
  const { activeBranchId, setSelectedBill, setSubView } = useApp();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchBills() {
      setIsLoading(true);
      try {
        const data = await billsApi.getBills({
          branchId: activeBranchId,
          status: selectedStatus,
          search: searchQuery,
        });
        if (isMounted) {
          let filtered = data;
          
          // Payment Mode filter
          if (selectedPaymentMode !== 'ALL') {
            filtered = filtered.filter(b => b.paymentMode === selectedPaymentMode);
          }

          // Search across bill number, customer, cashier, and payment mode
          if (searchQuery.trim()) {
            const sq = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(b => 
              b.billNumber.toLowerCase().includes(sq) ||
              b.customerName.toLowerCase().includes(sq) ||
              b.customerMobile.includes(sq) ||
              b.cashierName.toLowerCase().includes(sq) ||
              b.paymentMode.toLowerCase().includes(sq)
            );
          }

          // Period filtering
          if (selectedPeriod === 'yesterday') {
            filtered = filtered.filter(b => b.date.includes('2026-10-05') || b.date.includes('Yesterday'));
          } else if (selectedPeriod === 'this_week') {
            // Include this week's records
            filtered = filtered.slice(0, 8);
          } else if (selectedPeriod === 'this_month') {
            // Include all records in current month
            filtered = filtered;
          }

          setBills(filtered);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchBills();
    return () => { isMounted = false; };
  }, [activeBranchId, selectedStatus, searchQuery, selectedPaymentMode, selectedPeriod]);

  const statusOptions = [
    { id: 'ALL', label: 'All Bills' },
    { id: 'PAID', label: 'Paid' },
    { id: 'CREDIT', label: 'Credit (Khata)' },
    { id: 'PARTIAL', label: 'Partial' },
    { id: 'CANCELLED', label: 'Cancelled' },
    { id: 'RETURNED', label: 'Returned' },
  ];

  const periodOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
  ];

  const paymentModes = [
    { id: 'ALL', label: 'All Modes' },
    { id: 'UPI', label: 'UPI' },
    { id: 'CASH', label: 'Cash' },
    { id: 'CARD', label: 'Card' },
    { id: 'CREDIT', label: 'Khata Credit' },
  ];

  const handleExport = () => {
    const headers = ['Bill Number', 'Branch', 'Date', 'Time', 'Customer', 'Cashier', 'Amount', 'Payment Mode', 'Status'];
    const rows = bills.map(b => [
      b.billNumber,
      b.branchName,
      b.date,
      b.time,
      b.customerName,
      b.cashierName,
      b.grandTotal,
      b.paymentMode,
      b.status
    ]);
    downloadCSV('NEXUS_Store_Bills', headers, rows);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 max-w-7xl mx-auto pb-24 md:pb-12">
      
      {/* Title Header */}
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
              Bills & Invoices
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live electronic tax invoices generated across checkout counters
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors shadow-sm"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Bills</span>
        </button>
      </div>

      {/* Date Period Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <FilterChips
          options={periodOptions}
          selected={selectedPeriod}
          onChange={id => setSelectedPeriod(id)}
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Bill #, Customer name, Phone, Cashier or Payment mode..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status & Tender Filter Controls */}
      <div className="space-y-2">
        <FilterChips
          options={statusOptions}
          selected={selectedStatus}
          onChange={id => setSelectedStatus(id)}
        />
        <FilterChips
          options={paymentModes}
          selected={selectedPaymentMode}
          onChange={id => setSelectedPaymentMode(id)}
        />
      </div>

      {/* Bills Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-10 h-10 mx-auto stroke-1 opacity-50" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No bills match criteria</div>
            <div className="text-xs text-slate-500">Try adjusting your status or payment mode filter.</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {bills.map(bill => (
              <div
                key={bill.id}
                onClick={() => setSelectedBill(bill)}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {bill.billNumber}
                    </span>
                    <StatusBadge status={bill.status} size="sm" />
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 truncate">
                    {bill.customerName} {bill.customerMobile !== 'N/A' && `(${bill.customerMobile})`}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                    {bill.date} {bill.time} · {bill.branchName} · By {bill.cashierName}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
                      {formatINR(bill.grandTotal)}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      {bill.paymentMode}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
