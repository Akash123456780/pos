import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Receipt, 
  Boxes, 
  Users, 
  Truck, 
  CreditCard,
  Percent,
  CheckCircle2,
  FileDown,
  X,
  Printer,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { reportsApi, REPORT_DEFINITIONS, ReportPreviewResult } from '../../api/reportsApi';
import { downloadCSV, downloadExcelStub } from '../../utils/exportUtils';
import { MOCK_BRANCHES } from '../../data/mockData';
import { BranchId } from '../../types';

export const ReportsListView: React.FC = () => {
  const { setSubView, showToast, activeBranchId } = useApp();

  // Selected parameters for generation
  const [selectedBranch, setSelectedBranch] = useState<BranchId>(activeBranchId);
  const [dateRange, setDateRange] = useState<string>('This Month (Oct 2026)');
  const [activePreview, setActivePreview] = useState<ReportPreviewResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportList = REPORT_DEFINITIONS;

  const dateRangeOptions = [
    'Today (06 Oct 2026)',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'This Month (Oct 2026)',
    'Last Quarter (Q2 FY27)',
    'Financial Year 2026-27',
  ];

  const handleGenerateReport = async (reportId: string) => {
    setIsGenerating(true);
    try {
      const result = await reportsApi.generateReport(reportId, {
        dateRange,
        branchId: selectedBranch,
      });
      setActivePreview(result);
      showToast({
        type: 'success',
        title: `${result.reportName} Generated`,
        message: `Preview loaded with ${result.rows.length} rows for ${dateRange}.`,
      });
    } catch {
      showToast({ type: 'error', title: 'Report Generation Failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf', preview: ReportPreviewResult) => {
    if (format === 'csv') {
      downloadCSV(`NEXUS_${preview.reportId.toUpperCase()}_REPORT`, preview.headers, preview.rows);
      showToast({
        type: 'success',
        title: 'CSV File Downloaded',
        message: `${preview.reportName} exported successfully.`,
      });
    } else if (format === 'excel') {
      downloadExcelStub(`NEXUS_${preview.reportId.toUpperCase()}_REPORT`, preview.headers, preview.rows);
      showToast({
        type: 'success',
        title: 'Excel Spreadsheet Exported',
        message: `${preview.reportName} formatted workbook generated.`,
      });
    } else if (format === 'pdf') {
      window.print();
      showToast({
        type: 'info',
        title: 'PDF Print Dialog Opened',
        message: 'Select "Save as PDF" to store printable report document.',
      });
    }
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
              Store Reports & Audit Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              12 comprehensive financial, inventory, tax and operational reports with instant previews and exports
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSubView('gst')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>View Live GST Summary</span>
        </button>
      </div>

      {/* GLOBAL REPORT FILTER BAR: Date Range & Branch */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date range picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Period:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {dateRangeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Branch selector */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Store Branch:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value as BranchId)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Store Branches (Consolidated)</option>
              {MOCK_BRANCHES.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.shortCode})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing 12 Standard Reports
        </div>
      </div>

      {/* 12 REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportList.map(rep => (
          <div
            key={rep.id}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {rep.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: #{rep.id}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                {rep.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Scope: {selectedBranch === 'all' ? 'All Stores' : selectedBranch}</span>
                <span>{dateRange.split(' ')[0]}</span>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateReport(rep.id)}
                disabled={isGenerating}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate & Preview Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT PREVIEW MODAL / DRAWER */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activePreview.reportName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      GENERATED
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {activePreview.branchName} · {activePreview.dateRange} · Generated: {activePreview.generatedAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* 3 Export buttons: CSV, Excel, PDF */}
                <button
                  type="button"
                  onClick={() => handleExport('csv', activePreview)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExport('excel', activePreview)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExport('pdf', activePreview)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Preview Table */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <tr>
                      {activePreview.headers.map((h, i) => (
                        <th key={i} className={`py-3 px-3 font-bold ${i > 1 ? 'text-right' : ''}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activePreview.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`py-2.5 px-3 ${cIdx > 1 ? 'text-right' : ''} ${cIdx === 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals Footer */}
              {activePreview.summaryTotals && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Calculated Summary Totals:
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {Object.entries(activePreview.summaryTotals).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
