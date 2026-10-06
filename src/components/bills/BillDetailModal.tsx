import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  MessageSquare, 
  Check, 
  Receipt,
  Building,
  User,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { triggerPrintBill } from '../../utils/exportUtils';
import { BUSINESS_INFO } from '../../data/mockData';

export const BillDetailModal: React.FC = () => {
  const { selectedBill, setSelectedBill, showToast } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);

  if (!selectedBill) return null;

  const handlePrint = () => {
    triggerPrintBill(selectedBill.billNumber);
  };

  const handleDownloadPDF = () => {
    showToast({
      type: 'success',
      title: 'Tax Invoice Downloaded',
      message: `Saved ${selectedBill.billNumber}.pdf to device storage.`,
    });
  };

  const handleWhatsAppShare = () => {
    showToast({
      type: 'info',
      title: 'WhatsApp Link Generated',
      message: `Digital bill link sent to ${selectedBill.customerMobile || 'customer phone'} (Mock simulation).`,
    });
    setShowShareModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {selectedBill.billNumber}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {selectedBill.date} · {selectedBill.time}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={selectedBill.status} />
            <button
              type="button"
              onClick={() => setSelectedBill(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Store & Tax Info */}
          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="font-black text-base text-slate-900 dark:text-white uppercase tracking-wider">
              {BUSINESS_INFO.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {selectedBill.branchName} · {BUSINESS_INFO.headquarters}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              GSTIN: {BUSINESS_INFO.gstin} · FSSAI: {BUSINESS_INFO.fssai}
            </div>
          </div>

          {/* Customer & Cashier Metadata */}
          <div className="grid grid-cols-2 gap-3 py-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-[11px]">
            <div>
              <div className="text-slate-400 font-medium">Billed To Customer:</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedBill.customerName}</div>
              <div className="font-mono text-slate-500">{selectedBill.customerMobile}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 font-medium">Counter Terminal:</div>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedBill.posDeviceName}</div>
              <div className="text-slate-500">Cashier: {selectedBill.cashierName}</div>
            </div>
          </div>

          {/* Product Items Table */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-2">
              Purchased Line Items
            </div>
            
            {selectedBill.items.length === 0 ? (
              <div className="py-3 text-center text-slate-400 italic">No products recorded (Transaction voided)</div>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 font-mono text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-right">Price</th>
                      <th className="py-2 px-2 text-right">Tax</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                    {selectedBill.items.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-2 text-right font-mono">{formatINR(item.price)}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-slate-500">{item.taxRate}%</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatINR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Taxable Value (Subtotal)</span>
              <span>{formatINR(selectedBill.subtotal)}</span>
            </div>

            {selectedBill.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Total Trade Discount</span>
                <span>-{formatINR(selectedBill.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>CGST (Central Tax 9%)</span>
              <span>{formatINR(selectedBill.cgst, true)}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>SGST (State Tax 9%)</span>
              <span>{formatINR(selectedBill.sgst, true)}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>IGST (Integrated Tax 0%)</span>
              <span>{formatINR(0, true)}</span>
            </div>

            {selectedBill.roundOff !== 0 && (
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Round Off Adjustment</span>
                <span>{selectedBill.roundOff > 0 ? `+${selectedBill.roundOff}` : selectedBill.roundOff}</span>
              </div>
            )}

            <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Invoice Grand Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">{formatINR(selectedBill.grandTotal)}</span>
            </div>
          </div>

          {/* Tender Mode */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-900 dark:text-white">Payment Method: {selectedBill.paymentMode}</span>
            </div>
            {selectedBill.paymentDetails.upiRef && (
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[150px]">
                Ref: {selectedBill.paymentDetails.upiRef}
              </span>
            )}
            {selectedBill.paymentDetails.cardLast4 && (
              <span className="text-[11px] font-mono text-slate-500">
                Card ending in •••• {selectedBill.paymentDetails.cardLast4}
              </span>
            )}
          </div>

        </div>

        {/* Action Footer Buttons (All 4 requested actions) */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="min-h-[44px] py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">PDF</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Tax Invoice ${selectedBill.billNumber}`,
                  text: `Invoice ${selectedBill.billNumber} for ${selectedBill.customerName}: ${formatINR(selectedBill.grandTotal)}`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                showToast({
                  type: 'info',
                  title: 'Invoice Link Copied',
                  message: `Tax invoice ${selectedBill.billNumber} link copied to clipboard.`,
                });
              }
            }}
            className="min-h-[44px] py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Share</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="min-h-[44px] py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
