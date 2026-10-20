import type { DocumentStats } from '../types';
import { Key, ShieldAlert, FileQuestion, Copy } from 'lucide-react';

export interface StatsBarProps {
  stats: DocumentStats;
  hasInput: boolean;
}

export function StatsBar({ stats, hasInput }: StatsBarProps) {
  if (!hasInput) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
      <div className="flex items-center gap-1.5 font-medium">
        <Key className="h-3.5 w-3.5 text-slate-400" />
        <span>
          <strong className="text-slate-900 dark:text-slate-200">{stats.totalKeys}</strong> key
          {stats.totalKeys !== 1 ? 's' : ''} found
        </span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">•</span>

      <div className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span>
          <strong className="text-slate-900 dark:text-slate-200">{stats.removedValues}</strong>{' '}
          values removed
        </span>
      </div>

      {stats.keptValues > 0 && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span>
              <strong className="text-slate-900 dark:text-slate-200">{stats.keptValues}</strong> values
              kept
            </span>
          </div>
        </>
      )}

      {stats.unparsedLines > 0 && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <FileQuestion className="h-3.5 w-3.5" />
            <span>{stats.unparsedLines} unparsed line{stats.unparsedLines !== 1 ? 's' : ''}</span>
          </div>
        </>
      )}

      {stats.duplicateKeys > 0 && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <Copy className="h-3.5 w-3.5" />
            <span>{stats.duplicateKeys} duplicate keys</span>
          </div>
        </>
      )}

      {stats.sensitiveKeysCount > 0 && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{stats.sensitiveKeysCount} sensitive detected</span>
          </div>
        </>
      )}
    </div>
  );
}
