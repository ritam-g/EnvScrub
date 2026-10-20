import { LANDING_CONTENT } from '../content';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Lock, EyeOff, Terminal } from 'lucide-react';

const TRUST_ICONS = [
  <ShieldCheck key="client" className="h-5 w-5 text-emerald-500" />,
  <Lock key="csp" className="h-5 w-5 text-emerald-500" />,
  <EyeOff key="storage" className="h-5 w-5 text-emerald-500" />,
  <Terminal key="devtools" className="h-5 w-5 text-emerald-500" />,
];

export function TrustPrivacy() {
  const { trustPrivacy } = LANDING_CONTENT;

  return (
    <Section
      id="privacy"
      badge="Trust Architecture"
      title={trustPrivacy.title}
      subtitle={trustPrivacy.subtitle}
      className="border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {trustPrivacy.cards.map((card, idx) => (
          <Card key={card.title} className="p-5 sm:p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              {TRUST_ICONS[idx]}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* DevTools verification callout */}
      <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Try it yourself:
            </span>{' '}
            Press <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]">Ctrl+Shift+I</kbd>, navigate to the <strong>Network</strong> tab, and paste your config. Zero requests leave your machine.
          </div>
        </div>
      </div>
    </Section>
  );
}
