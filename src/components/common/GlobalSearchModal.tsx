import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Receipt, 
  Boxes, 
  Users, 
  Truck, 
  UserCheck, 
  Building2, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  MOCK_BILLS, 
  MOCK_PRODUCTS, 
  MOCK_CUSTOMERS, 
  MOCK_SUPPLIERS, 
  MOCK_STAFF, 
  MOCK_BRANCHES 
} from '../../data/mockData';
import { formatINR } from '../../utils/formatters';
import { BranchId } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    setSelectedBill, 
    setSelectedProduct, 
    setSelectedCustomer, 
    setSelectedSupplier,
    setSelectedStaff,
    setActiveBranchId,
    setSubView,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');

  // Close on Escape or open on Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // 1. Matched Bills
  const matchedBills = q ? MOCK_BILLS.filter(b => 
    b.billNumber.toLowerCase().includes(q) ||
    b.customerName.toLowerCase().includes(q) ||
    b.customerMobile.includes(q) ||
    b.cashierName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  // 2. Matched Products
  const matchedProducts = q ? MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    p.barcode.includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  // 3. Matched Customers
  const matchedCustomers = q ? MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.mobile.includes(q)
  ).slice(0, 3) : [];

  // 4. Matched Suppliers
  const matchedSuppliers = q ? MOCK_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.companyName.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  ).slice(0, 2) : [];

  // 5. Matched Staff
  const matchedStaff = q ? MOCK_STAFF.filter(st =>
    st.name.toLowerCase().includes(q) ||
    st.role.toLowerCase().includes(q) ||
    st.mobile.includes(q)
  ).slice(0, 2) : [];

  // 6. Matched Branches
  const matchedBranches = q ? MOCK_BRANCHES.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.city.toLowerCase().includes(q) ||
    b.shortCode.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const hasResults = matchedBills.length > 0 || 
    matchedProducts.length > 0 || 
    matchedCustomers.length > 0 || 
    matchedSuppliers.length > 0 || 
    matchedStaff.length > 0 || 
    matchedBranches.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-3 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search bills, products, customers, suppliers, staff, branches..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {!q && (
            <div className="py-10 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 stroke-1 opacity-50" />
              <p className="text-xs font-medium">Quick store lookup across all entities</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-4 text-[11px] text-slate-500">
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">INV-2026-0126</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Atta 10kg</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Priya Sharma</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Main Store</span>
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No records found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by partial invoice number, phone, SKU or branch name</p>
            </div>
          )}

          {/* 1. Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <Boxes className="w-3.5 h-3.5 text-emerald-500" />
                <span>Products & Inventory ({matchedProducts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Boxes className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            Product
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          Stock: <span className="font-bold text-slate-800 dark:text-slate-200">{p.currentStock} {p.unit}</span> · SKU: {p.sku}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="text-right">
                        <div className="font-bold font-mono text-slate-900 dark:text-white">{formatINR(p.salePrice)}</div>
                        <div className="text-[10px] text-slate-400 font-mono">MRP {formatINR(p.mrp)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Bills */}
          {matchedBills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <Receipt className="w-3.5 h-3.5 text-blue-500" />
                <span>Bills & Invoices ({matchedBills.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedBills.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBill(b);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold">
                        INV
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {b.billNumber}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-blue-100/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                            Bill
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {b.customerName} · <span className="font-mono text-slate-700 dark:text-slate-300">{b.branchName}</span> · {b.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="text-right">
                        <div className="font-bold font-mono text-slate-900 dark:text-white">{formatINR(b.grandTotal)}</div>
                        <div className="text-[10px] text-emerald-600 font-mono font-semibold">{b.paymentMode}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span>Customers & Khata ({matchedCustomers.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-purple-100/60 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                            Customer
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {c.mobile} · {c.segment}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="text-right">
                        {c.outstandingBalance > 0 ? (
                          <div className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">
                            Outstanding: {formatINR(c.outstandingBalance)}
                          </div>
                        ) : (
                          <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                            Total: {formatINR(c.totalPurchases)}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono">{c.loyaltyPoints} pts</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Suppliers */}
          {matchedSuppliers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <Truck className="w-3.5 h-3.5 text-teal-500" />
                <span>Suppliers ({matchedSuppliers.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedSuppliers.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSupplier(s);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {s.companyName}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-teal-100/60 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                            Supplier
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {s.name} ({s.mobile}) · {s.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono">Payable</div>
                        <div className="font-bold font-mono text-slate-900 dark:text-white">{formatINR(s.outstandingPayables)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Staff */}
          {matchedStaff.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Staff & Cashiers ({matchedStaff.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedStaff.map(st => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setSelectedStaff(st);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {st.name}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-100/60 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            Staff ({st.role})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {st.branchName} · {st.mobile}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <span className={`text-[11px] font-mono font-bold ${st.status === 'ONLINE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {st.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Branches */}
          {matchedBranches.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                <Building2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Store Branches ({matchedBranches.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedBranches.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setActiveBranchId(b.id as BranchId);
                      setActiveTab('home');
                      setSubView('none');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer group transition-colors border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {b.name}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-sky-100/60 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                            Branch
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {b.address} · {b.city} ({b.posCount} POS)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-right flex-shrink-0 pl-2">
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 font-mono">
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
