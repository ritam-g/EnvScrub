import React, { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { downloadFile } from '@/lib/download';
import { Copy, Check, Download, ShieldCheck } from 'lucide-react';

export interface OutputPanelProps {
  value: string;
  hasInput: boolean;
}

export function OutputPanel({ value, hasInput }: OutputPanelProps) {
  const { copy, copied } = useClipboard();
  const lineCount = value ? value.split('\n').length : 1;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);
  const linesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (linesRef.current) {
      linesRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleCopy = () => {
    if (value) {
      copy(value);
    }
  };

  const handleDownload = () => {
    if (value) {
      downloadFile(value, '.env');
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Output (.env format)</span>
          {value && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ({lineCount} line{lineCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* aria-live container for copy announcement */}
          <span className="sr-only" aria-live="polite">
            {copied ? 'Copied sanitized configuration to clipboard' : ''}
          </span>

          <Button
            type="button"
            variant={copied ? 'primary' : 'outline'}
            size="sm"
            disabled={!value}
            onClick={handleCopy}
            icon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-white dark:text-slate-950" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
            className="text-xs h-7 px-2.5"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={handleDownload}
            icon={<Download className="h-3.5 w-3.5" />}
            className="text-xs h-7 px-2.5"
            title="Download as clean .env file"
          >
            Download .env
          </Button>
        </div>
      </div>

      {/* Output Body */}
      <div className="relative flex flex-1 min-h-[340px] sm:min-h-[400px] overflow-hidden bg-slate-50/30 dark:bg-slate-950/30">
        {hasInput && value ? (
          <>
            {/* Line Numbers */}
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

            {/* Readonly Output */}
            <div
              ref={contentRef}
              data-testid="output-panel"
              onScroll={handleScroll}
              className="flex-1 w-full overflow-auto py-3 px-3.5 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-6 select-text whitespace-pre"
            >
              {value}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-600">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <ShieldCheck className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Clean output will appear here instantly
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              Paste your .env or DevOps config on the left or click &ldquo;Try sample&rdquo; above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
