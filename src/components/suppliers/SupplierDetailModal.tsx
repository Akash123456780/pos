import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard,
  Building,
  Receipt,
  Share2,
  FileDown,
  Printer,
  CheckCircle2,
  Calendar,
  Layers,
  History,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { BUSINESS_INFO, MOCK_PURCHASES } from '../../data/mockData';
import { downloadCSV } from '../../utils/exportUtils';
import { StatusBadge } from '../common/StatusBadge';

export const SupplierDetailModal: React.FC = () => {
  const { selectedSupplier, setSelectedSupplier, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'ledger' | 'purchases' | 'payments'>('ledger');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer / NEFT' | 'UPI' | 'Cheque' | 'Cash'>('Bank Transfer / NEFT');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [generatedReceipt, setGeneratedReceipt] = useState<{
    receiptNo: string;
    amount: number;
    method: string;
    refNumber?: string;
    notes?: string;
    date: string;
    time: string;
    prevBalance: number;
    newBalance: number;
  } | null>(null);

  if (!selectedSupplier) return null;

  const s = selectedSupplier;
  const purchases = MOCK_PURCHASES.filter(p => p.supplierId === s.id || p.supplierName.toLowerCase().includes(s.name.toLowerCase()));

  // Payments derived from ledger where type is PAYMENT or debit > 0
  const paymentHistory = s.ledgerEntries.filter(e => e.type === 'PAYMENT' || e.debit > 0);

  const handleShareStatement = () => {
    const text = `NEXUS Mart Wholesale Supplier Statement\nVendor: ${s.companyName} (${s.name})\nGSTIN: ${s.gstin}\nTotal Payables Due: ${formatINR(s.outstandingPayables)}\nDue Today: ${formatINR(s.dueToday)}\nAgreed Terms: ${s.paymentTerms}\nLast Procurement: ${s.lastPurchaseDate}`;
    if (navigator.share) {
      navigator.share({ title: `Vendor Statement - ${s.companyName}`, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast({
        type: 'success',
        title: 'Vendor Statement Copied',
        message: 'Supplier ledger summary copied to clipboard for email/WhatsApp.',
      });
    }
  };

  const handleDownloadStatement = () => {
    const headers = ['Date', 'Invoice / Reference', 'Type', 'Purchase (Credit)', 'Payment (Debit)', 'Outstanding Balance'];
    const rows = s.ledgerEntries.map(e => [
      e.date,
      e.invoiceNo,
      e.type,
      e.credit > 0 ? e.credit : 0,
      e.debit > 0 ? e.debit : 0,
      e.balance,
    ]);
    downloadCSV(`Supplier_Ledger_${s.companyName.replace(/\s+/g, '_')}`, headers, rows);
    showToast({
      type: 'success',
      title: 'Statement Downloaded',
      message: `Exported complete vendor transactions for ${s.companyName}.`,
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || isNaN(amt) || amt <= 0) return;

    const prevBal = s.outstandingPayables;
    const newBal = Math.max(0, prevBal - amt);
    s.outstandingPayables = newBal;
    s.dueToday = Math.max(0, s.dueToday - amt);
    s.isOverdue = newBal > 0 ? s.isOverdue : false;

    const refNum = paymentRefNumber.trim() ? paymentRefNumber.trim() : `DISB-${Date.now().toString().slice(-6)}`;
    const now = new Date();

    s.ledgerEntries.unshift({
      id: `sle_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      invoiceNo: refNum,
      type: 'PAYMENT',
      debit: amt,
      credit: 0,
      balance: newBal,
    });

    setGeneratedReceipt({
      receiptNo: refNum,
      amount: amt,
      method: paymentMethod,
      refNumber: paymentRefNumber.trim() || undefined,
      notes: paymentNotes.trim() || undefined,
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      prevBalance: prevBal,
      newBalance: newBal,
    });

    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentRefNumber('');
    setPaymentNotes('');
    showToast({
      type: 'success',
      title: 'Disbursement Recorded',
      message: `Transferred ${formatINR(amt)} to ${s.companyName} via ${paymentMethod}.`,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
        <div 
          className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{s.companyName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {s.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Vendor GSTIN: {s.gstin} · Contact: {s.name}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSupplier(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300">
            
            {/* Payables Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl font-mono text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Outstanding Payable</div>
                <div className={`text-base sm:text-lg font-black mt-0.5 ${s.outstandingPayables > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatINR(s.outstandingPayables)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {s.isOverdue ? 'Overdue payment' : 'Within agreed terms'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Due Today</div>
                <div className={`text-base sm:text-lg font-bold mt-0.5 ${s.dueToday > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {formatINR(s.dueToday)}
                </div>
                <div className="text-[10px] text-slate-400">Scheduled RTGS</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Total Purchases</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatINR(s.totalPurchases)}
                </div>
                <div className="text-[10px] text-slate-400">Lifetime Procurement</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Last Purchase</div>
                <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {s.lastPurchaseDate}
                </div>
                <div className="text-[10px] text-slate-400">{s.paymentTerms}</div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                Vendor Profile & Terms
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Key Account Contact:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="text-slate-700 dark:text-slate-300">{s.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{s.paymentTerms}</span>
                </div>
              </div>
              {s.address && (
                <div className="flex items-start justify-between text-[11px] gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 font-mono">
                  <span className="text-slate-400">Warehouse / Depot:</span>
                  <span className="text-right text-slate-700 dark:text-slate-300">{s.address}</span>
                </div>
              )}
            </div>

            {/* Vendor Actions Bar (Record Payment, View Purchases, Share Statement) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Vendor Ledger Actions
                </div>
                <div className="text-[11px] text-slate-400">
                  Record trade disbursements, inspect invoices or export statements
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('purchases')}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Purchases</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareStatement}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Share Statement</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStatement}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Download CSV Statement"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-500" />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR: Ledger / Purchase History / Payment History */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ledger'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ledger ({s.ledgerEntries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('purchases')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'purchases'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Purchase History ({purchases.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'payments'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Payment History ({paymentHistory.length})</span>
              </button>
            </div>

            {/* 1. LEDGER TAB */}
            {activeTab === 'ledger' && (
              <div>
                {s.ledgerEntries.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    No ledger transactions on file.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden font-mono text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-2">Reference</th>
                          <th className="py-2.5 px-2 text-right">Purchase (₹)</th>
                          <th className="py-2.5 px-2 text-right">Payment (₹)</th>
                          <th className="py-2.5 px-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {s.ledgerEntries.map(entry => (
                          <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-slate-500">{entry.date}</td>
                            <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                              {entry.invoiceNo}
                            </td>
                            <td className="py-2.5 px-2 text-right text-rose-600 font-bold">
                              {entry.credit > 0 ? formatINR(entry.credit) : '-'}
                            </td>
                            <td className="py-2.5 px-2 text-right text-emerald-600 font-bold">
                              {entry.debit > 0 ? formatINR(entry.debit) : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                              {formatINR(entry.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. PURCHASE HISTORY TAB */}
            {activeTab === 'purchases' && (
              <div className="space-y-3">
                {purchases.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    No procurement bills logged for this supplier yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {purchases.map(p => (
                      <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2 font-mono">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{p.purchaseNumber}</span>
                            <StatusBadge status={p.paymentStatus} size="sm" />
                          </div>
                          <span className="text-[11px] text-slate-500">{p.date} · {p.branchName}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          {p.items.map(item => `${item.productName} (${item.qty} ${item.unit})`).join(', ')}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                          <span className="text-slate-400">Total Billed: <strong className="text-slate-900 dark:text-white">{formatINR(p.grandTotal)}</strong></span>
                          <span>
                            {p.balanceAmount > 0 ? (
                              <span className="text-amber-600 font-bold">Due: {formatINR(p.balanceAmount)}</span>
                            ) : (
                              <span className="text-emerald-600 font-bold">Fully Cleared</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. PAYMENT HISTORY TAB */}
            {activeTab === 'payments' && (
              <div>
                {paymentHistory.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    No historical payments recorded.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden font-mono text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-2">Voucher / UTR</th>
                          <th className="py-2.5 px-2 text-right">Amount Disbursed</th>
                          <th className="py-2.5 px-3 text-right">Ledger Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {paymentHistory.map(entry => (
                          <tr key={entry.id}>
                            <td className="py-2.5 px-3 text-slate-500">{entry.date}</td>
                            <td className="py-2.5 px-2 font-bold text-slate-800 dark:text-slate-200">{entry.invoiceNo}</td>
                            <td className="py-2.5 px-2 text-right text-emerald-600 font-black">
                              {formatINR(entry.debit)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                              {formatINR(entry.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedSupplier(null)}
              className="py-2 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
            >
              Close Supplier Info
            </button>
          </div>

        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Record Supplier Disbursement
              </h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-500">
              Vendor: <span className="font-bold text-slate-800 dark:text-slate-200">{s.companyName}</span>
              <br />Outstanding balance: <span className="font-mono font-bold text-amber-600">{formatINR(s.outstandingPayables)}</span>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Disbursement Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="Enter amount paid"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Disbursement Mode</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Bank Transfer / NEFT', 'UPI', 'Cheque', 'Cash'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-2 rounded-lg font-medium text-[10px] truncate ${
                        paymentMethod === m
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Reference Number / UTR / Cheque No</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-HDFC-991823"
                  value={paymentRefNumber}
                  onChange={e => setPaymentRefNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Notes / Procurement Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Settlement for September Rice shipment"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-sm"
                >
                  Save Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED SUPPLIER PAYMENT RECEIPT MODAL */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-sans text-slate-800 dark:text-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Disbursement Advice
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{BUSINESS_INFO.name} · GSTIN: {BUSINESS_INFO.gstin}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Voucher / Advice:</span>
                <span className="font-bold text-slate-900 dark:text-white">{generatedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">{s.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span>{generatedReceipt.date} {generatedReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-bold text-emerald-600">{generatedReceipt.method}</span>
              </div>
              {generatedReceipt.refNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">UTR / Ref:</span>
                  <span className="text-slate-700 dark:text-slate-300">{generatedReceipt.refNumber}</span>
                </div>
              )}
              {generatedReceipt.notes && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Memo:</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{generatedReceipt.notes}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400">Amount Transferred:</span>
                <span className="text-sm font-black text-emerald-600">{formatINR(generatedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(generatedReceipt.newBalance)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast({ type: 'success', title: 'Printed Advice', message: 'Payment voucher sent to printer.' });
                  setGeneratedReceipt(null);
                }}
                className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1 text-[11px]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const adviceText = `Payment Disbursement Advice from ${BUSINESS_INFO.name}\nVoucher: ${generatedReceipt.receiptNo}\nBeneficiary: ${s.companyName}\nAmount Transferred: ${formatINR(generatedReceipt.amount)} via ${generatedReceipt.method}\nRemaining Payable: ${formatINR(generatedReceipt.newBalance)}\nDate: ${generatedReceipt.date} ${generatedReceipt.time}`;
                  if (navigator.share) {
                    navigator.share({ title: 'Payment Advice', text: adviceText }).catch(() => {});
                  } else {
                    navigator.clipboard?.writeText(adviceText);
                    showToast({ type: 'success', title: 'Advice Copied', message: 'Advice summary copied to clipboard for vendor.' });
                  }
                }}
                className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1 text-[11px] text-emerald-600"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={() => setGeneratedReceipt(null)}
                className="py-2 px-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold flex items-center justify-center text-[11px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
