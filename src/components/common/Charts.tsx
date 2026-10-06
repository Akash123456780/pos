import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';

interface AreaChartProps {
  data: { label: string; value: number; secondary?: number }[];
  height?: number;
  color?: string;
  isCurrency?: boolean;
  isLoading?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 180,
  color = '#10b981',
  isCurrency = true,
  isLoading = false,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">Loading data curve...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">No data points recorded</span>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const width = 1000;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = paddingY + chartHeight - ((d.value - min) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const handleTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const clientX = touch.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const nearestIndex = Math.round(ratio * (data.length - 1));
    setHoverIndex(nearestIndex);
  };

  return (
    <div className="w-full select-none">
      {/* Tooltip & Summary Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {activePoint ? activePoint.label : 'Current'}
          </span>
          <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {activePoint ? (isCurrency ? formatINR(activePoint.value) : activePoint.value.toLocaleString('en-IN')) : ''}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hoverIndex !== null && (
            <button
              type="button"
              onClick={() => setHoverIndex(null)}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-mono"
            >
              Reset
            </button>
          )}
          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
            Peak: {isCurrency ? formatINR(max) : max.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden w-full touch-pan-x" style={{ height }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={width - paddingX} y2={paddingY + chartHeight / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY / 2} x2={width - paddingX} y2={height - paddingY / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

          {/* Vertical guideline for active point */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingY}
              x2={activePoint.x}
              y2={height}
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />
          )}

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />

          {/* Data points */}
          {points.map((pt, idx) => (
            <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoverIndex(idx)} onClick={() => setHoverIndex(idx)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === idx ? 6 : 3.5}
                fill={hoverIndex === idx ? '#ffffff' : color}
                stroke={color}
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 px-1 pt-1 font-mono overflow-x-auto no-scrollbar">
        {data.map((d, i) => (
          <span 
            key={i} 
            className={`cursor-pointer transition-colors whitespace-nowrap px-0.5 ${hoverIndex === i ? 'text-emerald-700 dark:text-emerald-300 font-bold' : ''}`}
            onClick={() => setHoverIndex(i)}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

interface BarChartProps {
  data: { label: string; value: number; subLabel?: string }[];
  height?: number;
  color?: string;
  isCurrency?: boolean;
  isLoading?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 160,
  color = '#3b82f6',
  isCurrency = true,
  isLoading = false,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">Loading columns...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">No comparative data</span>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);

  return (
    <div className="w-full select-none">
      <div className="flex items-end justify-between gap-1.5 sm:gap-2 pt-4 pb-2" style={{ height }}>
        {data.map((item, i) => {
          const heightPercent = Math.max(8, (item.value / max) * 100);
          const isHovered = hoverIndex === i;
          return (
            <div 
              key={i} 
              className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => setHoverIndex(hoverIndex === i ? null : i)}
            >
              <div 
                className={`w-full rounded-t-lg transition-all duration-200 ${
                  isHovered ? 'bg-emerald-500 shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-700' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      {hoverIndex !== null && (
        <div className="text-center py-1.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-xl mt-1 font-mono transition-all">
          <span className="text-slate-500 font-normal">{data[hoverIndex].subLabel || data[hoverIndex].label}:</span>{' '}
          <span className="font-bold text-emerald-700 dark:text-emerald-300">
            {isCurrency ? formatINR(data[hoverIndex].value) : data[hoverIndex].value.toLocaleString('en-IN')}
          </span>
        </div>
      )}
    </div>
  );
};

interface DonutChartItem {
  label: string;
  value: number;
  color: string;
}

export const DonutChart: React.FC<{ items: DonutChartItem[]; centerLabel?: string; isLoading?: boolean }> = ({
  items,
  centerLabel = 'Total',
  isLoading = false,
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse">
        <span className="text-xs text-slate-400 font-mono">Loading distribution...</span>
      </div>
    );
  }

  const total = items.reduce((acc, it) => acc + it.value, 0) || 1;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2 select-none">
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          {items.map((item, idx) => {
            const percent = item.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            const isSelected = activeItemIndex === idx;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isSelected ? '18' : '15'}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer hover:opacity-90"
                onClick={() => setActiveItemIndex(activeItemIndex === idx ? null : idx)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            {activeItemIndex !== null ? items[activeItemIndex].label : centerLabel}
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate max-w-full">
            {formatINR(activeItemIndex !== null ? items[activeItemIndex].value : total)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {items.map((item, idx) => {
          const share = Math.round((item.value / total) * 100);
          const isSelected = activeItemIndex === idx;
          return (
            <div 
              key={idx} 
              onClick={() => setActiveItemIndex(activeItemIndex === idx ? null : idx)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono flex-shrink-0">
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(item.value)}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 w-8 text-right font-medium">{share}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * ProgressChart - Horizontal benchmark progress bars for targets & metrics
 */
export const ProgressChart: React.FC<{
  title: string;
  current: number;
  target: number;
  unit?: string;
  isCurrency?: boolean;
  isLoading?: boolean;
}> = ({ title, current, target, unit = '', isCurrency = true, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-1.5 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    );
  }

  const percent = Math.min(Math.round((current / (target || 1)) * 100), 100);

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          {isCurrency ? formatINR(current) : `${current} ${unit}`} / {isCurrency ? formatINR(target) : `${target} ${unit}`} ({percent}%)
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 100 ? 'bg-emerald-500' : percent >= 75 ? 'bg-emerald-600' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

/**
 * ComparisonChart - Grouped comparison bars (e.g. comparing 2 metrics or branches)
 */
export const ComparisonChart: React.FC<{
  categories: string[];
  seriesA: { name: string; values: number[]; color: string };
  seriesB: { name: string; values: number[]; color: string };
  isCurrency?: boolean;
  height?: number;
  isLoading?: boolean;
}> = ({ categories, seriesA, seriesB, isCurrency = true, height = 180, isLoading = false }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl animate-pulse" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">Loading comparison...</span>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl" style={{ height }}>
        <span className="text-xs text-slate-400 font-mono">No comparison data</span>
      </div>
    );
  }

  const allValues = [...seriesA.values, ...seriesB.values];
  const max = Math.max(...allValues, 1);

  return (
    <div className="w-full select-none space-y-2">
      {/* Legend */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[11px] text-slate-400">
          {activeCategoryIndex !== null ? 'Tap bar to inspect' : 'Comparative performance'}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: seriesA.color }} />
            <span className="text-slate-600 dark:text-slate-400">{seriesA.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: seriesB.color }} />
            <span className="text-slate-600 dark:text-slate-400">{seriesB.name}</span>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between gap-2 pt-3 pb-1" style={{ height }}>
        {categories.map((cat, idx) => {
          const valA = seriesA.values[idx] || 0;
          const valB = seriesB.values[idx] || 0;
          const hA = Math.max(8, (valA / max) * 100);
          const hB = Math.max(8, (valB / max) * 100);
          const isSelected = activeCategoryIndex === idx;

          return (
            <div 
              key={idx} 
              className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer p-1 rounded-xl transition-all ${
                isSelected ? 'bg-slate-100 dark:bg-slate-800/60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
              onClick={() => setActiveCategoryIndex(isSelected ? null : idx)}
            >
              <div className="w-full flex items-end justify-center gap-1 h-full">
                <div 
                  className="w-1/2 rounded-t-md transition-all duration-300"
                  style={{ height: `${hA}%`, backgroundColor: seriesA.color }}
                />
                <div 
                  className="w-1/2 rounded-t-md transition-all duration-300"
                  style={{ height: `${hB}%`, backgroundColor: seriesB.color }}
                />
              </div>
              <span className={`text-[10px] font-mono mt-2 truncate w-full text-center ${
                isSelected ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-500'
              }`}>
                {cat}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Selection Tooltip Box */}
      {activeCategoryIndex !== null && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs flex items-center justify-between font-mono animate-in fade-in duration-100">
          <div>
            <span className="font-bold text-slate-900 dark:text-white font-sans">{categories[activeCategoryIndex]}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 text-[10px]">{seriesA.name}:</span>{' '}
              <span className="font-bold">{isCurrency ? formatINR(seriesA.values[activeCategoryIndex]) : seriesA.values[activeCategoryIndex]}</span>
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 text-[10px]">{seriesB.name}:</span>{' '}
              <span className="font-bold">{isCurrency ? formatINR(seriesB.values[activeCategoryIndex]) : seriesB.values[activeCategoryIndex]}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
