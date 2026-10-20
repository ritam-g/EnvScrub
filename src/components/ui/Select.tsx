import React from 'react';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, id, ...props }, ref) => {
    return (
      <div className="relative inline-flex flex-col">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            {label}
          </label>
        )}
        <div className="relative inline-flex items-center">
          <select
            ref={ref}
            id={id}
            className={cn(
              'appearance-none rounded-lg border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-xs font-mono font-medium text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
