import { LANDING_CONTENT } from '../content';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { Check } from 'lucide-react';

export function SupportedFormats() {
  const { supportedFormats } = LANDING_CONTENT;

  return (
    <Section
      id="formats"
      badge="Compatibility"
      title={supportedFormats.title}
      subtitle={supportedFormats.subtitle}
      className="border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {supportedFormats.formats.map((fmt) => (
          <Card
            key={fmt.name}
            className="p-3.5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {fmt.name}
              </span>
            </div>
            <code className="block rounded-md bg-slate-100 dark:bg-slate-950 px-2.5 py-1 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre">
              {fmt.example}
            </code>
          </Card>
        ))}
      </div>
    </Section>
  );
}
