import { SENSITIVE_KEY_PATTERNS } from '../constants';
import type { ParsedLine } from '../types';

/**
 * Checks if a key name matches any known sensitive keyword patterns.
 *
 * STEP 1: Normalize the key to uppercase.
 * STEP 2: Test against known sensitive patterns (e.g. KEY, SECRET, TOKEN, PASSWORD, etc.).
 */
export function isSensitiveKey(key: string): boolean {
  if (!key) return false;
  const upper = key.toUpperCase();
  return SENSITIVE_KEY_PATTERNS.some((pattern) => upper.includes(pattern));
}

/**
 * Generates smart override dictionary for all detected keys in a document:
 * sensitive keys marked as 'remove', non-sensitive marked as 'keep'.
 *
 * STEP 1: Collect unique keys from parsed entry lines.
 * STEP 2: Evaluate sensitivity with isSensitiveKey().
 * STEP 3: Assign 'remove' for sensitive keys, 'keep' for others.
 */
export function getSmartOverrides(lines: ParsedLine[]): Record<string, 'keep' | 'remove'> {
  const overrides: Record<string, 'keep' | 'remove'> = {};

  for (const line of lines) {
    if (line.kind === 'entry' && !(line.key in overrides)) {
      overrides[line.key] = isSensitiveKey(line.key) ? 'remove' : 'keep';
    }
  }

  return overrides;
}
