import { useState, useMemo, useCallback } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  parseDocument,
  scrub,
  serialize,
  getSmartOverrides,
  SAMPLE_ENV_INPUT,
} from '../engine';
import type { ScrubOptions } from '../types';

export function useScrubber() {
  // Input state is purely in-memory — NEVER saved to localStorage or URL params
  const [rawInput, setRawInput] = useState<string>('');
  const debouncedInput = useDebouncedValue(rawInput, 150);

  // Global settings
  const [keepValues, setKeepValues] = useState<boolean>(false);
  const [spacing, setSpacing] = useLocalStorage<'tight' | 'spaced'>('envscrub_spacing', 'tight');
  const [overrides, setOverrides] = useState<Record<string, 'keep' | 'remove'>>({});

  // Parse document from debounced input
  const parsedLines = useMemo(() => {
    return parseDocument(debouncedInput);
  }, [debouncedInput]);

  // Detected unique keys
  const detectedKeys = useMemo(() => {
    const keys: string[] = [];
    const seen = new Set<string>();

    for (const line of parsedLines) {
      if (line.kind === 'entry' && !seen.has(line.key)) {
        seen.add(line.key);
        keys.push(line.key);
      }
    }

    return keys;
  }, [parsedLines]);

  // Scrub options
  const options: ScrubOptions = useMemo(
    () => ({
      keepValues,
      overrides,
      spacing,
    }),
    [keepValues, overrides, spacing]
  );

  // Scrub and compute stats
  const scrubResult = useMemo(() => {
    return scrub(parsedLines, options);
  }, [parsedLines, options]);

  // Final serialized output
  const serializedOutput = useMemo(() => {
    if (!debouncedInput.trim()) return '';
    return serialize(scrubResult.lines, spacing);
  }, [debouncedInput, scrubResult.lines, spacing]);

  // Action handlers
  const loadSample = useCallback(() => {
    setRawInput(SAMPLE_ENV_INPUT);
    setOverrides({});
  }, []);

  const clearInput = useCallback(() => {
    setRawInput('');
    setOverrides({});
  }, []);

  const toggleKeepValues = useCallback(() => {
    setKeepValues((prev) => !prev);
  }, []);

  const setOverride = useCallback((key: string, mode: 'keep' | 'remove') => {
    setOverrides((prev) => ({
      ...prev,
      [key]: mode,
    }));
  }, []);

  const toggleKey = useCallback(
    (key: string) => {
      setOverrides((prev) => {
        const currentMode = prev[key] ?? (keepValues ? 'keep' : 'remove');
        return {
          ...prev,
          [key]: currentMode === 'keep' ? 'remove' : 'keep',
        };
      });
    },
    [keepValues]
  );

  const applySmartSelect = useCallback(() => {
    const smart = getSmartOverrides(parsedLines);
    setOverrides(smart);
  }, [parsedLines]);

  const selectAllKeep = useCallback(() => {
    const next: Record<string, 'keep' | 'remove'> = {};
    for (const key of detectedKeys) {
      next[key] = 'keep';
    }
    setOverrides(next);
  }, [detectedKeys]);

  const selectAllRemove = useCallback(() => {
    const next: Record<string, 'keep' | 'remove'> = {};
    for (const key of detectedKeys) {
      next[key] = 'remove';
    }
    setOverrides(next);
  }, [detectedKeys]);

  const resetOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  return {
    rawInput,
    setRawInput,
    debouncedInput,
    keepValues,
    setKeepValues,
    toggleKeepValues,
    spacing,
    setSpacing,
    overrides,
    setOverride,
    toggleKey,
    applySmartSelect,
    selectAllKeep,
    selectAllRemove,
    resetOverrides,
    loadSample,
    clearInput,
    parsedLines,
    detectedKeys,
    scrubResult,
    serializedOutput,
    stats: scrubResult.stats,
  };
}
