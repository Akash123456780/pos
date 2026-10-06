import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  diffPercent?: number;
  diffLabel?: string;
  isPositive?: boolean;
  neutral?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  accentColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple' | 'slate';
  sparklineData?: number[];
  isLoading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subValue,
  diffPercent,
  diffLabel = 'vs yesterday',
  isPositive = true,
  neutral = false,
  icon,
  onClick,
  sparklineData,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 animate-pulse space-y-3">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>
    );
  }

  // Mini sparkline SVG generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const w = 70;
    const h = 24;

    const points = sparklineData.map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = neutral ? '#94a3b8' : isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg viewBox="0 0 70 24" className="w-12 sm:w-16 h-5 sm:h-6 overflow-visible flex-shrink-0" aria-hidden="true">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => { if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 select-none ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md active:scale-[0.98]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight truncate">
          {title}
        </span>
        {icon && (
          <span className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
          {value}
        </div>
        {renderSparkline()}
      </div>

      {subValue && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
          {subValue}
        </div>
      )}

      {diffPercent !== undefined && (
        <div className="flex items-center flex-wrap gap-1.5 mt-2.5 text-xs font-medium">
          {neutral ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <Minus className="w-3 h-3 stroke-[2.5]" />
              0.0%
            </span>
          ) : isPositive ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              +{Math.abs(diffPercent).toFixed(1)}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-mono font-bold text-[11px]">
              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
              -{Math.abs(diffPercent).toFixed(1)}%
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">
            {diffLabel}
          </span>
        </div>
      )}
    </div>
  );
};
