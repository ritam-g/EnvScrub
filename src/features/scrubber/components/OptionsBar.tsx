import { Sparkles, Shield, KeyRound } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface OptionsBarProps {
  keepValues: boolean;
  onToggleKeepValues: () => void;
  spacing: 'tight' | 'spaced';
  onSpacingChange: (spacing: 'tight' | 'spaced') => void;
  onSmartSelect: () => void;
  hasKeys: boolean;
}

export function OptionsBar({
  keepValues,
  onToggleKeepValues,
  spacing,
  onSpacingChange,
  onSmartSelect,
  hasKeys,
}: OptionsBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/90">
      {/* Mode Switch: Keep values toggle */}
      <div className="flex items-center gap-3">
        <Toggle
          id="keep-values-toggle"
          checked={keepValues}
          onChange={onToggleKeepValues}
          label={
            <div className="flex items-center gap-1.5 font-semibold">
              {keepValues ? (
                <>
                  <KeyRound className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-400">Keep values (clean .env)</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">
                    Remove values (safe to share)
                  </span>
                </>
              )}
            </div>
          }
          description={
            keepValues
              ? 'Values preserved, outer quotes & DevOps format stripped'
              : 'Keys preserved, all values removed'
          }
        />
      </div>

      {/* Controls: Spacing selector & Smart select */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <Select
          id="spacing-select"
          aria-label="Output spacing"
          value={spacing}
          onChange={(e) => onSpacingChange(e.target.value as 'tight' | 'spaced')}
          options={[
            { value: 'tight', label: 'KEY=value (standard)' },
            { value: 'spaced', label: 'KEY =value (spaced)' },
          ]}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasKeys}
          onClick={onSmartSelect}
          icon={<Sparkles className="h-3.5 w-3.5 text-emerald-500" />}
          className="text-xs"
          title="Auto-remove sensitive keys (tokens, secrets, passwords) and keep non-sensitive keys"
        >
          Smart select
        </Button>
      </div>
    </div>
  );
}
