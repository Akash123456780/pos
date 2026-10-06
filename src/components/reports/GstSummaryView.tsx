import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ArrowLeft, 
  FileDown, 
  ShieldCheck, 
  IndianRupee, 
  AlertCircle,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import { downloadCSV } from '../../utils/exportUtils';
import { BUSINESS_INFO } from '../../data/mockData';
import { gstApi, GstSummaryData, HsnSummaryItem, MonthlyGstFiling } from '../../api/gstApi';

export const GstSummaryView: React.FC = () => {
  const { setSubView, showToast } = useApp();
  const [gstData, setGstData] = useState<GstSummaryData>({
    taxableSales: 41230,
    cgst: 3710,
    sgst: 3710,
    igst: 0,
    totalOutputGst: 7420,
    purchaseTax: 4890,
    inputTaxCredit: 4890,
    netTaxLiability: 2530,
  });

  const [hsnSummary, setHsnSummary] = useState<HsnSummaryItem[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyGstFiling[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [summary, hsn, filings] = await Promise.all([
        gstApi.getGstSummary(),
        gstApi.getHsnSummary(),
        gstApi.getMonthlyFilings(),
      ]);
      if (isMounted) {
        setGstData(summary);
        setHsnSummary(hsn);
        setMonthlyHistory(filings);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleExportGST = () => {
    const headers = ['HSN', 'Description', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total Tax'];
    const rows = hsnSummary.map(h => [
      h.hsn,
      h.description,
      h.taxableValue,
      h.cgst,
      h.sgst,
      h.igst,
      h.totalTax,
    ]);
    downloadCSV('NEXUS_GST_HSN_Summary', headers, rows);
    showToast({
      type: 'success',
      title: 'GST & HSN Report Exported',
      message: 'Downloaded CSV file ready for chartered accountant / GST filing reconciliation.',
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Navigation */}
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
              GST Tax Summary (GSTR Estimation)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              GSTIN: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{BUSINESS_INFO.gstin}</span> · {BUSINESS_INFO.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportGST}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export HSN / GST Report</span>
        </button>
      </div>

      {/* STATUTORY DISCLAIMER (EXACT REQUIREMENT) */}
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="font-sans leading-relaxed">
          <span className="font-bold">Statutory Filing Notice: </span>
          &ldquo;These figures are management reports generated from POS data and should be verified before statutory filing.&rdquo;
        </div>
      </div>

      {/* 7 GST SUMMARY METRICS:
          Taxable Sales, CGST, SGST, IGST, Purchase Tax, Input Tax Credit, Net Tax Liability */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 font-mono">
        {/* 1. Taxable Sales */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">Taxable Sales</span>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
            {formatINR(gstData.taxableSales)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Billed Base</span>
        </div>

        {/* 2. CGST */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-blue-600 block truncate">CGST (Central)</span>
          <div className="text-sm sm:text-base font-black text-blue-600 mt-1">
            {formatINR(gstData.cgst)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Intra-state 50%</span>
        </div>

        {/* 3. SGST */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-purple-600 block truncate">SGST (State)</span>
          <div className="text-sm sm:text-base font-black text-purple-600 mt-1">
            {formatINR(gstData.sgst)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Intra-state 50%</span>
        </div>

        {/* 4. IGST */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">IGST (Inter)</span>
          <div className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-300 mt-1">
            {formatINR(gstData.igst)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Inter-state sales</span>
        </div>

        {/* 5. Purchase Tax */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">Purchase Tax</span>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
            {formatINR(gstData.purchaseTax)}
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Paid on POs</span>
        </div>

        {/* 6. Input Tax Credit */}
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block truncate">Input Tax Credit</span>
          <div className="text-sm sm:text-base font-black text-emerald-600 mt-1">
            {formatINR(gstData.inputTaxCredit)}
          </div>
          <span className="text-[10px] text-emerald-600 font-sans block mt-0.5">Claimable ITC</span>
        </div>

        {/* 7. Net Tax Liability */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block truncate">Net Tax Liability</span>
          <div className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {formatINR(gstData.netTaxLiability)}
          </div>
          <span className="text-[10px] text-emerald-600 font-sans block mt-0.5">Net Cash Payable</span>
        </div>
      </div>

      {/* HSN SUMMARY TABLE (EXACT COLUMNS: HSN, Description, Taxable Value, CGST, SGST, IGST, Total Tax) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              HSN Code-wise Outward Supplies Summary
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            GSTR-1 Table 12 Format
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
              <tr>
                <th className="py-2.5 px-3">HSN</th>
                <th className="py-2.5 px-2">Description</th>
                <th className="py-2.5 px-2 text-right">Taxable Value</th>
                <th className="py-2.5 px-2 text-right">CGST</th>
                <th className="py-2.5 px-2 text-right">SGST</th>
                <th className="py-2.5 px-2 text-right">IGST</th>
                <th className="py-2.5 px-3 text-right">Total Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              {hsnSummary.map(item => (
                <tr key={item.hsn} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {item.hsn}
                  </td>
                  <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300 font-sans">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white">
                    {formatINR(item.taxableValue)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-blue-600">
                    {formatINR(item.cgst)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-purple-600">
                    {formatINR(item.sgst)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {item.igst > 0 ? formatINR(item.igst) : '₹0'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                    {formatINR(item.totalTax)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MONTHLY COMPARISON */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Monthly Tax Filing Comparison (GSTR-3B)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-semibold">
            All Returns Filed on GSTN
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
          {monthlyHistory.map(row => (
            <div key={row.month} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{row.month}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  Turnover: <strong className="font-mono text-slate-700 dark:text-slate-300">{formatINR(row.turnover)}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Output GST</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formatINR(row.outputTax)}</div>
                </div>

                <div>
                  <div className="text-[10px] text-emerald-600 uppercase">Claimed ITC</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{formatINR(row.itc)}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Cash Paid</div>
                  <div className="font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{formatINR(row.netPayable)}</div>
                </div>

                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
