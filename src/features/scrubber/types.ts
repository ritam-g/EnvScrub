/**
 * Core domain types for the EnvScrub parsing and scrubbing engine.
 * Pure TypeScript with zero React or DOM dependencies.
 */

export type SourceFormat = 'dotenv' | 'json' | 'yaml';

export type ParsedLine =
  | { kind: 'blank'; raw: string }
  | { kind: 'comment'; raw: string }
  | { kind: 'unparsed'; raw: string }
  | {
      kind: 'entry';
      raw: string;
      key: string;
      value: string;
      exportPrefix: boolean;
      trailingComment?: string;
      sourceFormat: SourceFormat;
      isDuplicate?: boolean;
    };

export type ScrubOptions = {
  keepValues: boolean; // global switch
  overrides: Record<string, 'keep' | 'remove'>; // per-key overrides
  spacing: 'tight' | 'spaced'; // KEY= vs KEY =
};

export type ScrubbedLine =
  | { kind: 'blank'; raw: string }
  | { kind: 'comment'; raw: string }
  | { kind: 'unparsed'; raw: string }
  | {
      kind: 'entry';
      key: string;
      value: string;
      exportPrefix: boolean;
      trailingComment?: string;
      isRemoved: boolean;
      isDuplicate?: boolean;
    };

export type DocumentStats = {
  totalKeys: number;
  uniqueKeys: number;
  removedValues: number;
  keptValues: number;
  unparsedLines: number;
  duplicateKeys: number;
  sensitiveKeysCount: number;
};
