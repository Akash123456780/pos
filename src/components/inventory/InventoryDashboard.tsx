import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  AlertTriangle, 
  FileDown, 
  ArrowUpRight, 
  Calendar, 
  Layers, 
  PackageCheck, 
  PackageX, 
  Clock, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { inventoryApi } from '../../api';
import { Product, InventoryAlert } from '../../types';
import { FilterChips } from '../common/FilterChips';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';

export const InventoryDashboard: React.FC = () => {
  const { setSelectedProduct, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<'catalog' | 'alerts'>('catalog');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadInventory() {
      setIsLoading(true);
      try {
        const [prodList, alertList] = await Promise.all([
          inventoryApi.getProducts({ filterType, search: searchQuery }),
          inventoryApi.getInventoryAlerts(),
        ]);
        if (isMounted) {
          setProducts(prodList);
          setAlerts(alertList);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadInventory();
    return () => { isMounted = false; };
  }, [filterType, searchQuery]);

  const filterOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'low_stock', label: 'Low Stock (17)' },
    { id: 'out_of_stock', label: 'Out of Stock (4)' },
    { id: 'expiring', label: 'Expiring Soon (8)' },
    { id: 'expired', label: 'Expired Batches (0)' },
    { id: 'fast_moving', label: 'Fast Moving' },
    { id: 'slow_moving', label: 'Slow Moving' },
  ];

  const handleExport = () => {
    const headers = ['Product Name', 'SKU', 'Barcode', 'Category', 'Stock', 'MRP', 'Sale Price', 'Supplier'];
    const rows = products.map(p => [
      p.name,
      p.sku,
      p.barcode,
      p.category,
      `${p.currentStock} ${p.unit}`,
      p.mrp,
      p.salePrice,
      p.supplierName
    ]);
    downloadCSV('NEXUS_Inventory_Stock', headers, rows);
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Inventory & Stock
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-branch live stock levels, batch expiries, reorder alerts & valuations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Inventory</span>
          </button>
        </div>
      </div>

      {/* TOP INVENTORY KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Stock Value</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatINR(845200)}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">1,480 Total SKUs</span>
        </div>

        <div 
          onClick={() => { setActiveTab('alerts'); }}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Low Stock</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            17 Items
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Below min reorder</span>
        </div>

        <div 
          onClick={() => { setActiveTab('alerts'); }}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-rose-400 transition-colors"
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Out of Stock</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            4 Items
          </div>
          <span className="text-[10px] text-rose-600 font-semibold">Urgent PO needed</span>
        </div>

        <div 
          onClick={() => { setActiveTab('alerts'); }}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-amber-400 transition-colors"
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Expiring Soon</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            8 Batches
          </div>
          <span className="text-[10px] text-amber-600 font-medium">&lt; 30 Days shelf life</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">Turnover Health</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            4.2x / Year
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Optimal FMCG velocity</span>
        </div>
      </div>

      {/* VIEW SWITCHER: CATALOG VS ALERTS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'catalog'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          All Product Catalog ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'alerts'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Restock & Expiry Alerts ({alerts.length})</span>
        </button>
      </div>

      {/* CATALOG TAB */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by product name, SKU, barcode, brand, or category..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter chips */}
          <FilterChips
            options={filterOptions}
            selected={filterType}
            onChange={id => setFilterType(id)}
          />

          {/* Product cards / table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
                Scanning stock inventory across stores...
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Boxes className="w-10 h-10 mx-auto stroke-1 opacity-50 mb-2" />
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No items match your criteria</div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(prod => {
                  const isLow = prod.currentStock > 0 && prod.currentStock <= prod.minStock;
                  const isOut = prod.currentStock === 0;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {prod.name}
                          </span>
                          {isOut ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                              OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                              LOW STOCK
                            </span>
                          ) : null}
                          {prod.fastMoving && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-mono font-semibold">
                              <Zap className="w-3 h-3" />
                              Fast Moving
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {prod.category} · Brand: {prod.brand} · SKU: {prod.sku}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Supplier: {prod.supplierName}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                            {prod.currentStock} {prod.unit}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Sell: {formatINR(prod.salePrice)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            MRP {formatINR(prod.mrp)}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* DEDICATED ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500">
            Immediate purchase order & batch replenishment action required:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map(alt => (
              <div
                key={alt.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <StatusBadge status={alt.alertType} />
                    <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {alt.productName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {alt.category} · Branch: {alt.branchName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Current Stock</span>
                    <div className={`font-bold ${alt.currentStock === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                      {alt.currentStock} units
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Buffer Target</span>
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      {alt.requiredStock} units
                    </div>
                  </div>
                </div>

                {alt.daysToExpiry && (
                  <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batch expires on {alt.expiryDate} ({alt.daysToExpiry} days left)</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono truncate max-w-[180px]">
                    Vendor: {alt.supplierName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const found = products.find(p => p.id === alt.productId);
                      if (found) setSelectedProduct(found);
                      else showToast({ type: 'info', title: 'Product details loaded' });
                    }}
                    className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Product</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
