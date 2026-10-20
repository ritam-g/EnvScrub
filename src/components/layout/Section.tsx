import React from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  badge?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({
  id,
  title,
  subtitle,
  badge,
  containerSize = 'lg',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section id={id} className={cn('py-12 sm:py-16 lg:py-20', className)} {...props}>
      <Container size={containerSize}>
        {(badge || title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            {badge && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
