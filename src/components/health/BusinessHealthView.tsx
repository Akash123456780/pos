import React, { useState } from 'react';
import { 
  HeartPulse, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Boxes, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight,
  UserCheck,
  Percent,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export interface HealthCategoryItem {
  id: string;
  category: string;
  score: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  reason: string;
  recommendation: string;
  actionLabel: string;
  actionDestination: {
    type: 'tab' | 'subview';
    target: string;
  };
}

export const BusinessHealthView: React.FC = () => {
  const { setSubView, setActiveTab } = useApp();

  const overallScore = 89;

  // The 6 Required Categories: Sales, Profit, Inventory, Customer, Staff, Cash Flow
  const healthCategories: HealthCategoryItem[] = [
    {
      id: 'inventory',
      category: 'Inventory Health',
      score: 78,
      status: 'WARNING',
      reason: '17 products are below minimum stock buffer threshold.',
      recommendation: 'Replenish fast-moving staples and verify warehouse batch reorder limits before the weekend surge.',
      actionLabel: 'Review Inventory',
      actionDestination: { type: 'tab', target: 'inventory' },
    },
    {
      id: 'sales',
      category: 'Sales Health',
      score: 95,
      status: 'EXCELLENT',
      reason: 'Daily gross revenue up 11.2% exceeding monthly average run-rate with 96 completed store bills.',
      recommendation: 'Maintain active promotion banners on high-margin personal care and packaged items.',
      actionLabel: 'Analyze Sales Velocity',
      actionDestination: { type: 'tab', target: 'sales' },
    },
    {
      id: 'profit',
      category: 'Profit Health',
      score: 87,
      status: 'GOOD',
      reason: 'Gross profit margin holds strong at 29.2% with operational expenses under 14% of turnover.',
      recommendation: 'Review wholesale supplier rates for edible oil to capture additional 1.5% margin.',
      actionLabel: 'Inspect P&L Margins',
      actionDestination: { type: 'tab', target: 'sales' },
    },
    {
      id: 'customer',
      category: 'Customer Health',
      score: 92,
      status: 'EXCELLENT',
      reason: 'Repeat customer retention at 68% with low overdue credit ratio (₹26,300 total outstanding across 1,284 patrons).',
      recommendation: 'Send WhatsApp statement reminders to 2 credit accounts with balances approaching 30 days.',
      actionLabel: 'Review Customer Khata',
      actionDestination: { type: 'subview', target: 'customers' },
    },
    {
      id: 'staff',
      category: 'Staff Health',
      score: 88,
      status: 'GOOD',
      reason: 'All cashiers active on roster with 100% bill checkout throughput and authorized discount logs.',
      recommendation: 'Review terminal shift handover checklist and acknowledge cashier shift performance.',
      actionLabel: 'Monitor Staff Shifts',
      actionDestination: { type: 'subview', target: 'staff' },
    },
    {
      id: 'cashflow',
      category: 'Cash Flow Health',
      score: 84,
      status: 'GOOD',
      reason: 'Store daily inflows (₹48,650) comfortably cover scheduled trade payables (₹24,000 due today).',
      recommendation: 'Verify physical cash till count against calculated expected cash before closing shift.',
      actionLabel: 'Reconcile Cash Drawer',
      actionDestination: { type: 'subview', target: 'payments' },
    },
  ];

  const handleExecuteAction = (item: HealthCategoryItem) => {
    if (item.actionDestination.type === 'tab') {
      setActiveTab(item.actionDestination.target as any);
      setSubView('none');
    } else {
      setSubView(item.actionDestination.target as any);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title & Navigation */}
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
            Business Health Diagnostic
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic operational health score across 6 business pillars with actionable recommendations
          </p>
        </div>
      </div>

      {/* OVERALL HEALTH GAUGE HERO (89 / 100) */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Operations Diagnostic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Overall Health Score: {overallScore} / 100
          </h2>
          <p className="text-xs text-slate-400 max-w-lg font-light leading-relaxed">
            Your store is operating at <strong className="text-emerald-400 font-semibold">High Operational Efficiency</strong>. 5 of 6 business pillars are optimal, with priority buffer replenishment required on 17 low stock items.
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - overallScore / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-mono tracking-tight">{overallScore}</span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
          </div>
        </div>
      </div>

      {/* 6 HEALTH CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthCategories.map(cat => {
          const isWarning = cat.score < 80;

          return (
            <div
              key={cat.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 transition-all"
            >
              <div>
                {/* Header: Name, Score, Status */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {cat.category}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Score: <strong className="text-slate-900 dark:text-white font-bold">{cat.score} / 100</strong>
                    </div>
                  </div>
                  <StatusBadge status={cat.status} />
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                    Observed Metric / Reason:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {cat.reason}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Actionable Recommendation:</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cat.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Button: Direct module navigation */}
              <button
                type="button"
                onClick={() => handleExecuteAction(cat)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  isWarning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                }`}
              >
                <span>{cat.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
