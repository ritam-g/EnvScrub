import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, Sparkles, FileCode2, UploadCloud } from 'lucide-react';

export interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onTrySample: () => void;
  onClear: () => void;
}

export function InputPanel({ value, onChange, onTrySample, onClear }: InputPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const lineCount = value ? value.split('\n').length : 1;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (linesRef.current) {
      linesRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      try {
        const text = await file.text();
        onChange(text);
      } catch {
        // Fallback or ignore unreadable files
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col h-full rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-emerald-500/50 ${
        isDragging
          ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
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
            className="text-xs h-7 px-2 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Load a realistic sample config"
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
              className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer transition-colors"
              title="Clear all input"
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
          className="flex-1 w-full resize-none border-none bg-transparent py-3 px-3.5 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 leading-6 focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-600 cursor-text"
        />

        {/* Drag and drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] border-2 border-dashed border-emerald-500 rounded-xl flex flex-col items-center justify-center p-6 text-emerald-700 dark:text-emerald-300 pointer-events-none transition-all">
            <UploadCloud className="h-10 w-10 text-emerald-500 mb-2 animate-bounce" />
            <p className="font-semibold text-sm">Drop your .env or config file here</p>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Read 100% in-browser. Never uploaded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
