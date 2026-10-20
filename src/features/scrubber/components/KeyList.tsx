import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { isSensitiveKey } from '../engine';
import type { ParsedLine } from '../types';
import { Search, ShieldAlert, Key, CheckSquare, Square } from 'lucide-react';

export interface KeyListProps {
  parsedLines: ParsedLine[];
  detectedKeys: string[];
  globalKeepValues: boolean;
  overrides: Record<string, 'keep' | 'remove'>;
  onToggleKey: (key: string) => void;
  onSelectAllKeep: () => void;
  onSelectAllRemove: () => void;
  onResetOverrides: () => void;
}

export function KeyList({
  parsedLines,
  detectedKeys,
  globalKeepValues,
  overrides,
  onToggleKey,
  onSelectAllKeep,
  onSelectAllRemove,
  onResetOverrides,
}: KeyListProps) {
  const [search, setSearch] = useState('');

  // Collect duplicate status per key
  const duplicateKeySet = useMemo(() => {
    const dupes = new Set<string>();
    for (const line of parsedLines) {
      if (line.kind === 'entry' && line.isDuplicate) {
        dupes.add(line.key);
      }
    }
    return dupes;
  }, [parsedLines]);

  // Filter keys
  const filteredKeys = useMemo(() => {
    if (!search.trim()) return detectedKeys;
    const q = search.toLowerCase();
    return detectedKeys.filter((k) => k.toLowerCase().includes(q));
  }, [detectedKeys, search]);

  if (detectedKeys.length === 0) return null;

  const hasCustomOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-4 transition-colors">
      {/* Header and bulk actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Key className="h-4 w-4 text-emerald-500" />
            <span>Per-Key Overrides</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({detectedKeys.length} detected)
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selectively keep safe values (e.g. PORT) while scrubbing secrets. Checked = Keep value.
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSelectAllKeep}
            className="text-xs h-7 px-2"
          >
            Keep all
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSelectAllRemove}
            className="text-xs h-7 px-2"
          >
            Remove all
          </Button>
          {hasCustomOverrides && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetOverrides}
              className="text-xs h-7 px-2"
            >
              Reset to default
            </Button>
          )}
        </div>
      </div>

      {/* Search box if more than 5 keys */}
      {detectedKeys.length > 5 && (
        <div className="my-3 relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keys..."
            aria-label="Search keys"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-8 pr-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      )}

      {/* Key grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {filteredKeys.map((key) => {
          const effectiveMode = overrides[key] ?? (globalKeepValues ? 'keep' : 'remove');
          const isKept = effectiveMode === 'keep';
          const isSensitive = isSensitiveKey(key);
          const isDupe = duplicateKeySet.has(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggleKey(key)}
              aria-label={`Toggle value retention for key ${key}. Currently ${isKept ? 'kept' : 'removed'}`}
              className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-left transition-all ${
                isKept
                  ? 'border-amber-300/80 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isKept ? (
                  <CheckSquare className="h-4 w-4 text-amber-500 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-slate-400 shrink-0" />
                )}
                <span className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {key}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isSensitive && (
                  <Badge variant="rose" size="sm" title="Sensitive key detected">
                    <ShieldAlert className="h-2.5 w-2.5 mr-0.5" />
                    secret
                  </Badge>
                )}
                {isDupe && (
                  <Badge variant="amber" size="sm" title="Duplicate key">
                    duplicate
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
