/**
 * Constants for the scrubber engine.
 */

export const SENSITIVE_KEY_PATTERNS = [
  'KEY',
  'SECRET',
  'TOKEN',
  'PASSWORD',
  'PASS',
  'PWD',
  'PRIVATE',
  'CREDENTIAL',
  'AUTH',
  'DSN',
  'CONNECTION',
  'URI',
] as const;

export const VALID_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_.-]*$/;

export const DEFAULT_SPACING: 'tight' | 'spaced' = 'tight';
