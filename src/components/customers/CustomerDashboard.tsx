import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft, 
  FileDown, 
  AlertCircle, 
  ChevronRight, 
  Award, 
  CreditCard,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { customerApi } from '../../api';
import { Customer } from '../../types';
import { FilterChips } from '../common/FilterChips';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';

export const CustomerDashboard: React.FC = () => {
  const { setSelectedCustomer, setSubView } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchCustomers() {
      setIsLoading(true);
      try {
        const data = await customerApi.getCustomers(searchQuery, selectedSegment);
        if (isMounted) setCustomers(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchCustomers();
    return () => { isMounted = false; };
  }, [searchQuery, selectedSegment]);

  const segmentOptions = [
    { id: 'ALL', label: 'All Customers' },
    { id: 'VIP', label: 'VIP Members' },
    { id: 'Credit Customer', label: 'Credit (Khata)' },
    { id: 'Regular', label: 'Regular' },
    { id: 'New', label: 'New' },
  ];

  const handleExport = () => {
    const headers = ['Name', 'Mobile', 'Segment', 'Total Purchases', 'Outstanding', 'Loyalty Points'];
    const rows = customers.map(c => [
      c.name,
      c.mobile,
      c.segment,
      c.totalPurchases,
      c.outstandingBalance,
      c.loyaltyPoints
    ]);
    downloadCSV('NEXUS_Customer_Khata_Directory', headers, rows);
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
              Customers & Receivables
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customer loyalty profiles, store credit limits & khata ledger
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Customers</span>
        </button>
      </div>

      {/* TOP RECEIVABLES & CUSTOMER KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono block truncate">Total Customers</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            1,842
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+34 this month</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono block truncate">Active Customers</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            1,420
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">77.1% active rate</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono block truncate">New Customers</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            68
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">Enrolled 30d</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono block truncate">Total Outstanding</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(142800)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Khata Receivables</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] sm:text-[11px] font-medium text-rose-500 uppercase tracking-wider font-mono block truncate">Overdue Amount</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {formatINR(18450)}
          </div>
          <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">&gt; 30d aging risk</span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by customer name or phone number..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* SEGMENT CHIPS */}
      <FilterChips
        options={segmentOptions}
        selected={selectedSegment}
        onChange={id => setSelectedSegment(id)}
      />

      {/* CUSTOMERS LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
            Loading customer profiles...
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {customers.map(c => {
              const availableCredit = Math.max(0, c.creditLimit - c.outstandingBalance);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {c.name}
                      </span>
                      <StatusBadge status={c.segment} size="sm" />
                      {c.isOverdue && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded font-mono">
                          OVERDUE ({c.creditDueDays}d)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {c.mobile}
                      </span>
                      <span>·</span>
                      <span>{c.totalOrders} Visits</span>
                      <span>·</span>
                      <span>Last: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{c.lastPurchaseDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>Credit Limit: <strong className="text-slate-700 dark:text-slate-300">{formatINR(c.creditLimit)}</strong></span>
                      <span>·</span>
                      <span className={availableCredit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                        Avail: {formatINR(availableCredit)}
                      </span>
                      <span>·</span>
                      <span>Loyalty: {c.loyaltyPoints} pts</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Total Purchase</div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {formatINR(c.totalPurchases)}
                      </div>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-[10px] uppercase font-mono text-slate-400">Outstanding</div>
                      <div className={`text-sm font-black font-mono ${c.outstandingBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {formatINR(c.outstandingBalance)}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
