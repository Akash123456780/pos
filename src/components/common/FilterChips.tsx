import React from 'react';

interface FilterOption<T extends string> {
  id: T;
  label: string;
  badge?: number | string;
}

interface FilterChipsProps<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onChange: (id: T) => void;
  className?: string;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onChange,
  className = '',
}: FilterChipsProps<T>) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 ${className}`}>
      {options.map(opt => {
        const isActive = opt.id === selected;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-200/80 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
