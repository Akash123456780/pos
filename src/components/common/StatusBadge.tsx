import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'md',
}) => {
  // Determine variant automatically if not provided
  const s = status.toUpperCase();
  let v = variant;
  if (!v) {
    if (['PAID', 'ONLINE', 'APPROVED', 'ACTIVE', 'EXCELLENT'].includes(s)) v = 'success';
    else if (['PARTIAL', 'CREDIT', 'IDLE', 'GOOD', 'WARNING', 'EXPIRY_SOON', 'LOW_STOCK'].includes(s)) v = 'warning';
    else if (['CANCELLED', 'RETURNED', 'OFFLINE', 'OUT_OF_STOCK', 'EXPIRED', 'CRITICAL'].includes(s)) v = 'danger';
    else if (['VIP', 'MANAGER', 'ADMIN', 'INFO'].includes(s)) v = 'info';
    else v = 'neutral';
  }

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
  };

  const textColors = {
    success: 'text-emerald-700 dark:text-emerald-400',
    warning: 'text-amber-700 dark:text-amber-400',
    danger: 'text-rose-700 dark:text-rose-400',
    info: 'text-blue-700 dark:text-blue-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'} ${textColors[v]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[v]}`} />
      <span>{status}</span>
    </span>
  );
};
