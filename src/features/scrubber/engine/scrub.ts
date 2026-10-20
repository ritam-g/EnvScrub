import type { ParsedLine, ScrubOptions, ScrubbedLine, DocumentStats } from '../types';
import { isSensitiveKey } from './sensitiveKeys';

export interface ScrubResult {
  lines: ScrubbedLine[];
  stats: DocumentStats;
}

/**
 * Transforms an array of parsed lines according to scrub options.
 *
 * STEP 1: Process each parsed line, preserving blanks, comments, and unparsed lines.
 * STEP 2: For entries, determine retention based on precedence:
 *         per-key override takes precedence over global keepValues switch.
 * STEP 3: Assign clean value if kept, or empty string if removed.
 * STEP 4: Compute comprehensive document stats (total, unique, removed, kept, unparsed, duplicates, sensitive).
 */
export function scrub(lines: ParsedLine[], options: ScrubOptions): ScrubResult {
  const scrubbedLines: ScrubbedLine[] = [];
  const uniqueKeys = new Set<string>();
  const sensitiveKeys = new Set<string>();

  let totalKeys = 0;
  let removedValues = 0;
  let keptValues = 0;
  let unparsedLines = 0;
  let duplicateKeys = 0;

  for (const line of lines) {
    if (line.kind === 'blank') {
      scrubbedLines.push({ kind: 'blank', raw: line.raw });
      continue;
    }

    if (line.kind === 'comment') {
      scrubbedLines.push({ kind: 'comment', raw: line.raw });
      continue;
    }

    if (line.kind === 'unparsed') {
      scrubbedLines.push({ kind: 'unparsed', raw: line.raw });
      unparsedLines++;
      continue;
    }

    // Line is an entry
    totalKeys++;
    uniqueKeys.add(line.key);
    if (isSensitiveKey(line.key)) {
      sensitiveKeys.add(line.key);
    }
    if (line.isDuplicate) {
      duplicateKeys++;
    }

    // Determine keep vs remove precedence
    const override = options.overrides[line.key];
    const shouldKeep = override !== undefined ? override === 'keep' : options.keepValues;

    if (shouldKeep) {
      keptValues++;
      scrubbedLines.push({
        kind: 'entry',
        key: line.key,
        value: line.value,
        exportPrefix: line.exportPrefix,
        trailingComment: line.trailingComment,
        isRemoved: false,
        isDuplicate: line.isDuplicate,
      });
    } else {
      removedValues++;
      scrubbedLines.push({
        kind: 'entry',
        key: line.key,
        value: '',
        exportPrefix: line.exportPrefix,
        trailingComment: line.trailingComment,
        isRemoved: true,
        isDuplicate: line.isDuplicate,
      });
    }
  }

  const stats: DocumentStats = {
    totalKeys,
    uniqueKeys: uniqueKeys.size,
    removedValues,
    keptValues,
    unparsedLines,
    duplicateKeys,
    sensitiveKeysCount: sensitiveKeys.size,
  };

  return { lines: scrubbedLines, stats };
}
