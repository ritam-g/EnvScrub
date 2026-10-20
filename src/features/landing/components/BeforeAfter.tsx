import { LANDING_CONTENT } from '../content';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function BeforeAfter() {
  const { beforeAfter } = LANDING_CONTENT;

  return (
    <Section
      id="before-after"
      badge="Visual Comparison"
      title={beforeAfter.title}
      subtitle={beforeAfter.subtitle}
      className="border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Card */}
        <Card className="flex flex-col overflow-hidden border-rose-200/80 dark:border-rose-950/80">
          <div className="flex items-center justify-between px-4 py-3 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-950/50">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                {beforeAfter.beforeTitle}
              </span>
            </div>
            <Badge variant="rose" size="sm">
              Contains Secrets & Quotes
            </Badge>
          </div>
          <div className="p-4 font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-950/30 whitespace-pre overflow-x-auto flex-1">
            {beforeAfter.beforeCode}
          </div>
        </Card>

        {/* After Card: Shows both Sanitize mode and Clean mode */}
        <div className="flex flex-col gap-4">
          {/* Mode 1: Sanitize (values removed) */}
          <Card className="overflow-hidden border-emerald-200/80 dark:border-emerald-950/80">
            <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-950/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  {beforeAfter.afterSanitizeTitle}
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                Safe for AI & Tickets
              </Badge>
            </div>
            <div className="p-3.5 font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-950/30 whitespace-pre overflow-x-auto">
              {beforeAfter.afterSanitizeCode}
            </div>
          </Card>

          {/* Mode 2: Clean (quotes stripped) */}
          <Card className="overflow-hidden border-indigo-200/80 dark:border-indigo-950/80">
            <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-950/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                  {beforeAfter.afterCleanTitle}
                </span>
              </div>
              <Badge variant="indigo" size="sm">
                Quotes Removed
              </Badge>
            </div>
            <div className="p-3.5 font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed bg-slate-50/30 dark:bg-slate-950/30 whitespace-pre overflow-x-auto">
              {beforeAfter.afterCleanCode}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
