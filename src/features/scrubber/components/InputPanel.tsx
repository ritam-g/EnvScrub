import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, Sparkles, FileCode2 } from 'lucide-react';

export interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onTrySample: () => void;
  onClear: () => void;
}

export function InputPanel({ value, onChange, onTrySample, onClear }: InputPanelProps) {
  const lineCount = value ? value.split('\n').length : 1;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (linesRef.current) {
      linesRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          <FileCode2 className="h-4 w-4 text-emerald-500" />
          <span>Input (.env, JSON, or YAML)</span>
          {value && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ({lineCount} line{lineCount !== 1 ? 's' : ''} · {value.length} chars)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onTrySample}
            icon={<Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
            className="text-xs h-7 px-2"
          >
            Try sample
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              icon={<Trash2 className="h-3 w-3 text-rose-500" />}
              className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex flex-1 min-h-[340px] sm:min-h-[400px] overflow-hidden bg-slate-50/30 dark:bg-slate-950/30">
        {/* Line Numbers Column */}
        <div
          ref={linesRef}
          aria-hidden="true"
          className="w-10 sm:w-12 py-3 select-none text-right pr-2 text-xs font-mono text-slate-400/80 dark:text-slate-600 border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={`# Paste your .env or DevOps config here...\nPORT=3000\nDATABASE_URL="postgres://user:secret@localhost:5432/db"\n"API_KEY": "sk_test_12345",\nexport DEBUG=true`}
          aria-label="Configuration input"
          className="flex-1 w-full resize-none border-none bg-transparent py-3 px-3.5 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-6 focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
