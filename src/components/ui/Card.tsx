import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'glass';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl',
    surface:
      'bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl',
    glass:
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-xl shadow-lg',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
