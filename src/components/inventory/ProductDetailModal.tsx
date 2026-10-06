import React from 'react';
import { 
  X, 
  Boxes, 
  Tag, 
  Truck, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  History,
  TrendingDown,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useApp();

  if (!selectedProduct) return null;

  const p = selectedProduct;
  const isLow = p.currentStock > 0 && p.currentStock <= p.minStock;
  const isOut = p.currentStock === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">
                {p.name}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                SKU: {p.sku} · Barcode: {p.barcode}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Stock & Status Highlight */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Current Stock</div>
              <div className={`text-lg font-bold mt-0.5 ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                {p.currentStock} {p.unit}
              </div>
              <div className="text-[10px] text-slate-400">
                {isOut ? 'Depleted' : isLow ? 'Low buffer' : 'Adequate'}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Min Reorder</div>
              <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {p.minStock} {p.unit}
              </div>
              <div className="text-[10px] text-slate-400">Safety margin</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase">Gross Margin</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {p.marginPercent.toFixed(1)}%
              </div>
              <div className="text-[10px] text-emerald-600">Per unit sold</div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-2">
              Commercial Pricing Structure
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">Purchase Rate</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                  {formatINR(p.purchasePrice)}
                </span>
                <span className="text-[10px] text-slate-400">Excl. vendor GST</span>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-mono">Selling Price</span>
                <span className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">
                  {formatINR(p.salePrice)}
                </span>
                <span className="text-[10px] text-emerald-600">POS checkout price</span>
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-mono">Printed MRP</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                  {formatINR(p.mrp)}
                </span>
                <span className="text-[10px] text-slate-400">Maximum retail</span>
              </div>
            </div>
          </div>

          {/* Industry Specific Attributes (Dynamically matched to product type) */}
          {p.industryAttributes && (
            <div>
              <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-2">
                Industry Specifications · {p.industryAttributes.type.toUpperCase()}
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2.5">
                
                {/* 1. GROCERY: Weight, Batch, Mfg Date, Expiry Date */}
                {p.industryAttributes.type === 'grocery' && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Net Weight / Pack Size:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {p.industryAttributes.weightVolume || p.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Batch Number:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {p.batchNumber || 'BAT-2026-GR99'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Manufacturing Date:</span>
                      <span className="font-medium text-slate-900 dark:text-white font-mono">
                        {p.mfgDate || '2026-08-15'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Best Before / Expiry:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {p.expiryDate || '2027-02-15'}
                      </span>
                    </div>
                    {p.industryAttributes.storageType && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-slate-400">Storage Condition:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {p.industryAttributes.storageType}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* 2. CLOTHING: Size, Color, Fabric, Fit, Gender */}
                {p.industryAttributes.type === 'clothing' && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Garment Size:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                        {p.industryAttributes.size || 'L'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Color Variant:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {p.industryAttributes.color || 'Navy Blue'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Fabric Composition:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {p.industryAttributes.fabric || '100% Combed Cotton'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Apparel Fit:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {p.industryAttributes.fit || 'Regular Fit'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Demographic / Gender:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {p.industryAttributes.gender || 'Men'}
                      </span>
                    </div>
                  </>
                )}

                {/* 3. ELECTRONICS: IMEI, Serial Number, Warranty */}
                {p.industryAttributes.type === 'electronics' && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Device IMEI:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.industryAttributes.imeiSerial || '864720049281726'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Serial Number:</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {`SN-NX-${p.sku}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">OEM Warranty Coverage:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {p.industryAttributes.warrantyMonths || 12} Months On-Site / Carry-in
                      </span>
                    </div>
                  </>
                )}

                {/* 4. PHARMACY: Dosage, Batch, Expiry, Prescription category */}
                {p.industryAttributes.type === 'pharmacy' && (
                  <>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Dosage Form & Strength:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {p.industryAttributes.dosageForm || 'Tablet 500mg Strip of 10'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Batch Code:</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {p.batchNumber || 'RX-2026-B82'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Expiry Date:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {p.expiryDate || '2027-11-30'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Prescription Category:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-[11px]">
                        {p.industryAttributes.scheduleCategory || 'Schedule H (Prescription Required)'}
                      </span>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* Multi-Branch Allocation */}
          <div>
            <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-2">
              Branch Stock Allocation
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-mono">
                <span className="text-[10px] text-slate-400 block">Main Store</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {p.branchStock.branch_1 ?? 0} {p.unit}
                </span>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-mono">
                <span className="text-[10px] text-slate-400 block">City Branch</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {p.branchStock.branch_2 ?? 0} {p.unit}
                </span>
              </div>
              <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-mono">
                <span className="text-[10px] text-slate-400 block">Market Branch</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {p.branchStock.branch_3 ?? 0} {p.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 block">Primary Supplier</span>
                <span className="font-semibold text-slate-900 dark:text-white">{p.supplierName}</span>
              </div>
            </div>
          </div>

          {/* Movement history */}
          {p.stockHistory && p.stockHistory.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-semibold uppercase text-slate-400 mb-2">
                Recent Stock Movements
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                {p.stockHistory.map((mv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{mv.date}</span>
                      <span className="capitalize text-slate-700 dark:text-slate-300 font-sans">{mv.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${mv.change > 0 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {mv.change > 0 ? `+${mv.change}` : mv.change}
                      </span>
                      <span className="text-slate-400 w-16 text-right">Bal: {mv.balance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="py-2 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
