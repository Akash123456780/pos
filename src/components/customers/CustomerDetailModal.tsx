import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Award, 
  MessageSquare, 
  Receipt, 
  AlertCircle,
  FileText,
  Printer,
  CheckCircle2,
  Share2,
  FileDown,
  ShoppingBag,
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { BUSINESS_INFO } from '../../data/mockData';
import { downloadCSV } from '../../utils/exportUtils';

export const CustomerDetailModal: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer, setSubView, showToast } = useApp();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Other'>('UPI');
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

  if (!selectedCustomer) return null;

  const c = selectedCustomer;
  const availableCredit = Math.max(0, c.creditLimit - c.outstandingBalance);
  const avgOrderValue = c.totalOrders > 0 ? Math.round(c.totalPurchases / c.totalOrders) : 0;

  const handleSendReminder = () => {
    showToast({
      type: 'info',
      title: 'Khata Payment Reminder Dispatched',
      message: `SMS reminder for ${formatINR(c.outstandingBalance)} sent to ${c.mobile}.`,
    });
  };

  const handleDownloadStatement = () => {
    const headers = ['Date', 'Reference / Description', 'Type', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)'];
    const rows = c.ledgerEntries.map(e => [
      e.date,
      e.refNumber,
      e.type,
      e.debit > 0 ? e.debit : 0,
      e.credit > 0 ? e.credit : 0,
      e.balance,
    ]);
    downloadCSV(`Khata_Statement_${c.name.replace(/\s+/g, '_')}_${c.mobile}`, headers, rows);
    showToast({
      type: 'success',
      title: 'Statement Downloaded',
      message: `Khata ledger statement exported for ${c.name}.`,
    });
  };

  const handleShareStatement = () => {
    const text = `NEXUS Mart Khata Statement\nCustomer: ${c.name} (${c.mobile})\nTotal Outstanding: ${formatINR(c.outstandingBalance)}\nCredit Limit: ${formatINR(c.creditLimit)}\nAvailable Credit: ${formatINR(availableCredit)}\nLast Transaction: ${c.lastPurchaseDate}`;
    if (navigator.share) {
      navigator.share({
        title: `Khata Statement - ${c.name}`,
        text,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast({
        type: 'success',
        title: 'Statement Copied',
        message: 'Khata summary copied to clipboard for sharing.',
      });
    }
  };

  const handleViewBills = () => {
    setSelectedCustomer(null);
    setSubView('bills');
    showToast({
      type: 'info',
      title: 'Viewing Customer Bills',
      message: `Showing store invoices for ${c.name}.`,
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (!amt || isNaN(amt) || amt <= 0) return;

    const prevBal = c.outstandingBalance;
    const newBal = Math.max(0, prevBal - amt);
    c.outstandingBalance = newBal;
    c.isOverdue = newBal > 0 ? c.isOverdue : false;

    const receiptNum = paymentRefNumber.trim() ? paymentRefNumber.trim() : `RCP-${Date.now().toString().slice(-6)}`;
    const now = new Date();

    c.ledgerEntries.unshift({
      id: `le_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      type: 'PAYMENT',
      refNumber: receiptNum,
      debit: 0,
      credit: amt,
      balance: newBal,
    });

    setGeneratedReceipt({
      receiptNo: receiptNum,
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
      title: 'Payment Received',
      message: `Successfully received ${formatINR(amt)} via ${paymentMethod}.`,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
        <div 
          className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{c.name}</span>
                  <StatusBadge status={c.segment} size="sm" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {c.mobile} · Member since {c.joinedDate}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Digital Khata Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300">
            
            {/* Outstanding & Credit Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl font-mono text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Outstanding Khata</div>
                <div className={`text-base sm:text-lg font-black mt-0.5 ${c.outstandingBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatINR(c.outstandingBalance)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {c.isOverdue ? `${c.creditDueDays}d overdue` : 'Within terms'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Credit Limit</div>
                <div className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  {formatINR(c.creditLimit)}
                </div>
                <div className="text-[10px] text-slate-400">
                  Avail: {formatINR(availableCredit)}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Total Purchases</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatINR(c.totalPurchases)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {c.totalOrders} visits · Avg {formatINR(avgOrderValue)}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase">Last Purchase</div>
                <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {c.lastPurchaseDate}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  {c.loyaltyPoints} loyalty pts
                </div>
              </div>
            </div>

            {/* Profile & Purchase Summary Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
                Customer Profile & Purchase Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mobile Number:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category / Segment:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.segment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered On:</span>
                  <span className="text-slate-700 dark:text-slate-300">{c.joinedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Order Frequency:</span>
                  <span className="text-slate-700 dark:text-slate-300">{c.totalOrders} completed visits</span>
                </div>
              </div>
              {c.address && (
                <div className="flex items-start justify-between text-[11px] gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Delivery Address:</span>
                  <span className="text-right text-slate-700 dark:text-slate-300 font-mono">{c.address}</span>
                </div>
              )}
            </div>

            {/* Khata Settlement & Action Bar (Record Payment, View Bills, Share Statement, Download Statement) */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Khata Management & Actions
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Settle ledger, dispatch statements or inspect historic receipts
                  </div>
                </div>
                {c.outstandingBalance > 0 && (
                  <button
                    type="button"
                    onClick={handleSendReminder}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Send SMS Reminder
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewBills}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Bills</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareStatement}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>Share Statement</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStatement}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Download Statement</span>
                </button>
              </div>
            </div>

            {/* Digital Khata Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  Digital Khata Ledger Statements
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {c.ledgerEntries.length} Records
                </span>
              </div>

              {c.ledgerEntries.length === 0 ? (
                <div className="py-6 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                  No ledger transactions on record.
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden font-mono text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-2">Reference</th>
                        <th className="py-2.5 px-2 text-right">Debit (₹)</th>
                        <th className="py-2.5 px-2 text-right">Credit (₹)</th>
                        <th className="py-2.5 px-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {c.ledgerEntries.map(entry => (
                        <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-slate-500">{entry.date}</td>
                          <td className="py-2.5 px-2 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                            {entry.refNumber}
                          </td>
                          <td className="py-2.5 px-2 text-right text-rose-600 font-bold">
                            {entry.debit > 0 ? formatINR(entry.debit) : '-'}
                          </td>
                          <td className="py-2.5 px-2 text-right text-emerald-600 font-bold">
                            {entry.credit > 0 ? formatINR(entry.credit) : '-'}
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

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="py-2 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
            >
              Close Khata
            </button>
          </div>

        </div>
      </div>

      {/* RECORD PAYMENT RECEIPT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Record Khata Payment Received
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
              Customer: <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
              <br />Outstanding balance: <span className="font-mono font-bold text-rose-600">{formatINR(c.outstandingBalance)}</span>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="Enter settled amount"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Mode</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Cash', 'UPI', 'Card', 'Other'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded-lg font-medium text-[11px] ${
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
                <label className="block text-slate-500 font-medium mb-1">Reference Number / UTR (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/491024982 or Cash Slip #22"
                  value={paymentRefNumber}
                  onChange={e => setPaymentRefNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared Diwali festival balance"
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
                  Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED PAYMENT RECEIPT MODAL */}
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
                Payment Receipt
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{BUSINESS_INFO.name} · GSTIN: {BUSINESS_INFO.gstin}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt No:</span>
                <span className="font-bold text-slate-900 dark:text-white">{generatedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold font-sans text-slate-900 dark:text-white">{c.name}</span>
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
                  <span className="text-slate-400">Ref / UTR:</span>
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
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-sm font-black text-emerald-600">{formatINR(generatedReceipt.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Due:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(generatedReceipt.newBalance)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast({ type: 'success', title: 'Printed Receipt', message: 'Demo receipt sent to printer.' });
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
                  const receiptText = `Payment Receipt from ${BUSINESS_INFO.name}\nReceipt: ${generatedReceipt.receiptNo}\nCustomer: ${c.name}\nAmount Paid: ${formatINR(generatedReceipt.amount)} via ${generatedReceipt.method}\nRemaining Balance: ${formatINR(generatedReceipt.newBalance)}\nDate: ${generatedReceipt.date} ${generatedReceipt.time}`;
                  if (navigator.share) {
                    navigator.share({ title: 'Payment Receipt', text: receiptText }).catch(() => {});
                  } else {
                    navigator.clipboard?.writeText(receiptText);
                    showToast({ type: 'success', title: 'Receipt Copied', message: 'Receipt text copied to clipboard for WhatsApp/SMS.' });
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
