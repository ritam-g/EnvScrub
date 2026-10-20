import { VALID_KEY_REGEX } from '../constants';
import type { ParsedLine, SourceFormat } from '../types';

/**
 * Helper: Extracts a quoted string and any remainder after the closing quote.
 * Handles escaped quotes (e.g. \" or \').
 */
export function extractQuotedValue(
  str: string,
  quoteChar: string
): { value: string; remainder: string; isClosed: boolean } {
  let isEscaped = false;
  let closingIndex = -1;

  for (let i = 1; i < str.length; i++) {
    const char = str[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (char === quoteChar) {
      closingIndex = i;
      break;
    }
  }

  if (closingIndex === -1) {
    return { value: str.slice(1), remainder: '', isClosed: false };
  }

  return {
    value: str.slice(1, closingIndex),
    remainder: str.slice(closingIndex + 1),
    isClosed: true,
  };
}

/**
 * Parses a single configuration or environment line.
 *
 * STEP 1: Detect blank lines and full-line comments (#).
 * STEP 2: Detect and strip any leading 'export ' prefix.
 * STEP 3: Detect line syntax (DevOps JSON line, YAML key: value, or dotenv key=value).
 * STEP 4: Validate the extracted key against VALID_KEY_REGEX.
 * STEP 5: Parse value, stripping outer quotes if present and extracting trailing comments (#).
 */
export function parseLine(rawLine: string): ParsedLine {
  // STEP 1: Blank or comment lines
  const trimmed = rawLine.trim();
  if (trimmed === '') {
    return { kind: 'blank', raw: rawLine };
  }
  if (trimmed.startsWith('#')) {
    return { kind: 'comment', raw: rawLine };
  }

  // STEP 2: Handle 'export ' prefix
  let workingLine = trimmed;
  let exportPrefix = false;
  if (workingLine.startsWith('export ')) {
    exportPrefix = true;
    workingLine = workingLine.slice(7).trim();
  }

  // STEP 3: Detect line syntax and separators
  let rawKey = '';
  let rawVal = '';
  let format: SourceFormat = 'dotenv';

  // Check for JSON-style key with quotes: "KEY": ... or 'KEY': ...
  const jsonMatch = workingLine.match(/^(['"])(.*?)\1\s*:\s*([\s\S]*)$/);
  if (jsonMatch) {
    rawKey = jsonMatch[2];
    rawVal = jsonMatch[3];
    format = 'json';
  } else {
    // Check for dotenv (= separator) vs YAML (: separator)
    const equalsIdx = workingLine.indexOf('=');
    const colonIdx = workingLine.indexOf(':');

    if (equalsIdx !== -1 && (colonIdx === -1 || equalsIdx < colonIdx)) {
      rawKey = workingLine.slice(0, equalsIdx);
      rawVal = workingLine.slice(equalsIdx + 1);
      format = 'dotenv';
    } else if (colonIdx !== -1) {
      rawKey = workingLine.slice(0, colonIdx);
      rawVal = workingLine.slice(colonIdx + 1);
      format = 'yaml';
    } else {
      // No separator found -> unparsed
      return { kind: 'unparsed', raw: rawLine };
    }
  }

  // STEP 4: Clean and validate key
  // Strip outer quotes if any, and trim
  let cleanKey = rawKey.trim();
  if (
    (cleanKey.startsWith('"') && cleanKey.endsWith('"')) ||
    (cleanKey.startsWith("'") && cleanKey.endsWith("'"))
  ) {
    cleanKey = cleanKey.slice(1, -1).trim();
  }

  if (!VALID_KEY_REGEX.test(cleanKey)) {
    return { kind: 'unparsed', raw: rawLine };
  }

  // STEP 5: Parse value and trailing comments
  const trimmedVal = rawVal.trim();
  let cleanValue = '';
  let trailingComment: string | undefined = undefined;

  const firstChar = trimmedVal[0];
  if (firstChar === '"' || firstChar === "'") {
    const quoted = extractQuotedValue(trimmedVal, firstChar);
    cleanValue = quoted.value;

    let remainder = quoted.remainder.trim();
    // In JSON format, a trailing comma might exist immediately after the quote
    if (format === 'json' && remainder.startsWith(',')) {
      remainder = remainder.slice(1).trim();
    }
    // Check for inline trailing comment
    if (remainder.startsWith('#')) {
      trailingComment = remainder.slice(1).trim();
    }
  } else {
    // Unquoted value: check if value is empty and starts directly with a comment
    if (trimmedVal.startsWith('#')) {
      cleanValue = '';
      trailingComment = trimmedVal.slice(1).trim();
    } else {
      // Check for inline comment preceded by space (" #")
      const commentIdx = trimmedVal.indexOf(' #');
      if (commentIdx !== -1) {
        cleanValue = trimmedVal.slice(0, commentIdx).trim();
        trailingComment = trimmedVal.slice(commentIdx + 2).trim();
      } else {
        cleanValue = trimmedVal;
      }
    }

    // In JSON format, strip trailing comma from unquoted primitives (e.g. 5000, or true,)
    if (format === 'json' && cleanValue.endsWith(',')) {
      cleanValue = cleanValue.slice(0, -1).trim();
    }
  }

  return {
    kind: 'entry',
    raw: rawLine,
    key: cleanKey,
    value: cleanValue,
    exportPrefix,
    trailingComment,
    sourceFormat: format,
  };
}
