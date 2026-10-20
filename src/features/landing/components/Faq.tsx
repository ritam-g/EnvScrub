import { useState } from 'react';
import { LANDING_CONTENT } from '../content';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Faq() {
  const { faq } = LANDING_CONTENT;
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <Section
      id="faq"
      badge="FAQ"
      title={faq.title}
      subtitle={faq.subtitle}
      className="border-t border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {faq.items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);

          return (
            <Card key={item.question} className="overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 dark:text-white text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                    isOpen && 'rotate-180 text-emerald-500'
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {item.answer}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
