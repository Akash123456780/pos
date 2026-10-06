import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  ArrowLeft, 
  FileDown, 
  AlertCircle, 
  ChevronRight, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supplierApi } from '../../api';
import { Supplier, Purchase } from '../../types';
import { FilterChips } from '../common/FilterChips';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';

export const SupplierDashboard: React.FC = () => {
  const { setSelectedSupplier, setSubView } = useApp();
  const [activeTab, setActiveTab] = useState<'suppliers' | 'purchases'>('suppliers');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [supList, purList] = await Promise.all([
          supplierApi.getSuppliers(searchQuery),
          supplierApi.getPurchases(),
        ]);
        if (isMounted) {
          setSuppliers(supList);
          setPurchases(purList);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [searchQuery]);

  const handleExportSuppliers = () => {
    const headers = ['Company', 'Contact', 'Mobile', 'GSTIN', 'Total Purchases', 'Outstanding Payables'];
    const rows = suppliers.map(s => [s.companyName, s.name, s.mobile, s.gstin, s.totalPurchases, s.outstandingPayables]);
    downloadCSV('NEXUS_Supplier_Directory', headers, rows);
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
              Suppliers & Purchases
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Wholesale vendor accounts, trade payables & procurement orders
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportSuppliers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Vendors</span>
        </button>
      </div>

      {/* TOP KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Vendors Fleet</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            5 Wholesale Partners
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active supply contracts</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Total Payables</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(215400)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Trade credit accounts</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-amber-500 uppercase tracking-wider font-mono">Due Today</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {formatINR(24000)}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">National Staples Depot</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-rose-500 uppercase tracking-wider font-mono">Overdue Payables</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {formatINR(89400)}
          </div>
          <span className="text-[10px] text-rose-500 font-semibold">Balaji FMCG Traders</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('suppliers')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'suppliers'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Suppliers Directory ({suppliers.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('purchases')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'purchases'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Procurement Invoices ({purchases.length})
        </button>
      </div>

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by company or contact person..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {suppliers.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {s.companyName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {s.category}
                    </span>
                    {s.isOverdue && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded font-mono">
                        OVERDUE
                      </span>
                    )}
                    {s.dueToday > 0 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded font-mono">
                        DUE TODAY: {formatINR(s.dueToday)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Contact: {s.name} ({s.mobile})
                    </span>
                    <span>·</span>
                    <span>Terms: {s.paymentTerms}</span>
                    <span>·</span>
                    <span>Last Purchase: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{s.lastPurchaseDate}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    GSTIN: {s.gstin} · Total Purchases to Date: <strong className="text-slate-700 dark:text-slate-300">{formatINR(s.totalPurchases)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Total Procured</div>
                    <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                      {formatINR(s.totalPurchases)}
                    </div>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Outstanding</div>
                    <div className={`text-sm font-black font-mono ${s.outstandingPayables > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {formatINR(s.outstandingPayables)}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PURCHASES TAB */}
      {activeTab === 'purchases' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {purchases.map(pur => (
            <div key={pur.id} className="p-3 sm:p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {pur.purchaseNumber}
                  </span>
                  <StatusBadge status={pur.paymentStatus} size="sm" />
                </div>

                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                  {pur.supplierName} · {pur.branchName}
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {pur.date} · {pur.itemsCount} Products in Bill
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(pur.grandTotal)}
                </div>
                {pur.balanceAmount > 0 && (
                  <div className="text-[11px] text-amber-600 font-mono">
                    Pending: {formatINR(pur.balanceAmount)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
