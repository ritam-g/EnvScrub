import { AlertTriangle } from 'lucide-react';

export interface SecretWarningProps {
  show: boolean;
  keptCount: number;
}

export function SecretWarning({ show, keptCount }: SecretWarningProps) {
  if (!show || keptCount === 0) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm transition-all dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1 text-xs sm:text-sm">
        <span className="font-semibold">Security Alert:</span> Output contains {keptCount} active value{keptCount !== 1 ? 's' : ''}.{' '}
        <span className="font-bold underline decoration-amber-500/50">Do not share this output</span> in public chats, tickets, or release emails.
      </div>
    </div>
  );
}
