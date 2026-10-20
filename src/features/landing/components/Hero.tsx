import { LANDING_CONTENT } from '../content';
import { Shield, Lock, WifiOff, CheckCircle2, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const { hero } = LANDING_CONTENT;

  return (
    <div className="pt-8 pb-10 sm:pt-12 sm:pb-14 text-center">
      {/* Privacy guarantee badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-6 shadow-xs animate-fade-in">
        <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{hero.privacyBadge}</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
        {hero.headline}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
          {hero.headlineHighlight}
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        {hero.subheadline}
      </p>

      {/* Trust Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-medium">
          <Shield className="h-3.5 w-3.5 text-emerald-500" />
          100% Client-Side
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          No Sign-Up or Login
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-medium">
          <WifiOff className="h-3.5 w-3.5 text-emerald-500" />
          Works Offline
        </span>
      </div>

      {/* Quick jump CTA */}
      <div className="mt-8 flex justify-center">
        <a href="#tool">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowDown className="h-4 w-4" />}
            className="shadow-md shadow-emerald-500/10 font-semibold"
          >
            Start Scrubbing
          </Button>
        </a>
      </div>
    </div>
  );
}
