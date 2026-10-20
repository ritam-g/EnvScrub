import { LANDING_CONTENT } from '../content';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { ClipboardPaste, SlidersHorizontal, CheckCheck } from 'lucide-react';

const STEP_ICONS = [
  <ClipboardPaste key="paste" className="h-6 w-6 text-emerald-500" />,
  <SlidersHorizontal key="choose" className="h-6 w-6 text-emerald-500" />,
  <CheckCheck key="copy" className="h-6 w-6 text-emerald-500" />,
];

export function HowItWorks() {
  const { howItWorks } = LANDING_CONTENT;

  return (
    <Section
      id="how-it-works"
      badge="Workflow"
      title={howItWorks.title}
      subtitle={howItWorks.subtitle}
      className="border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {howItWorks.steps.map((step, idx) => (
          <Card
            key={step.number}
            className="p-6 relative flex flex-col justify-between hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md dark:hover:shadow-emerald-950/20 transition-all duration-300 group cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  {STEP_ICONS[idx]}
                </div>
                <span className="text-2xl font-mono font-bold text-slate-300 dark:text-slate-700">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
