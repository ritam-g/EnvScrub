import { ShieldCheck, Heart } from 'lucide-react';
import { Container } from './Container';

function GithubIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 transition-colors">
      <Container size="lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Privacy promise */}
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>
                Env<span className="text-emerald-500">Scrub</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share your config, not your secrets. 100% client-side. Nothing is ever uploaded.
            </p>
          </div>

          {/* Links & credit */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <a
              href="https://github.com/ritam-g/EnvScrub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>for developers</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span>© {currentYear} EnvScrub</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
