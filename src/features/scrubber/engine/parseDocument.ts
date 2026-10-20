import { parseLine, extractQuotedValue } from './parseLine';
import { VALID_KEY_REGEX } from '../constants';
import type { ParsedLine } from '../types';

/**
 * Splits a single-line JSON object into comma-separated key-value pairs,
 * respecting quoted strings.
 */
function splitJsonObjectEntries(content: string): string[] {
  const entries: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';
  let isEscaped = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (isEscaped) {
      current += char;
      isEscaped = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      isEscaped = true;
      continue;
    }

    if (!inQuote && (char === '"' || char === "'")) {
      inQuote = true;
      quoteChar = char;
      current += char;
    } else if (inQuote && char === quoteChar) {
      inQuote = false;
      current += char;
    } else if (!inQuote && char === ',') {
      if (current.trim()) {
        entries.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    entries.push(current.trim());
  }

  return entries;
}

/**
 * Parses a complete configuration document into an array of ParsedLine objects.
 *
 * STEP 1: Strip UTF-8 BOM (\uFEFF) if present.
 * STEP 2: Normalize line endings (\r\n and \r to \n) and split into lines.
 * STEP 3: Iterate through lines with multi-line quote lookahead (e.g. private keys).
 * STEP 4: Handle single-line JSON object expansions if encountered.
 * STEP 5: Mark duplicate keys across all entry lines.
 */
export function parseDocument(rawDocument: string): ParsedLine[] {
  // STEP 1: Strip BOM
  let cleaned = rawDocument;
  if (cleaned.startsWith('\uFEFF')) {
    cleaned = cleaned.slice(1);
  }

  // STEP 2: Normalize line endings
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = cleaned.split('\n');

  const parsedLines: ParsedLine[] = [];
  let i = 0;

  // STEP 3: Iterate through lines
  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // STEP 4: Check if single line is a full JSON object: { "KEY": "value", ... }
    if (trimmed.startsWith('{') && trimmed.endsWith('}') && trimmed.length > 2) {
      const inner = trimmed.slice(1, -1).trim();
      const subEntries = splitJsonObjectEntries(inner);
      let allSubEntriesValid = subEntries.length > 0;

      const tempParsed: ParsedLine[] = [];
      for (const sub of subEntries) {
        const subParsed = parseLine(sub);
        if (subParsed.kind === 'entry') {
          tempParsed.push(subParsed);
        } else {
          allSubEntriesValid = false;
          break;
        }
      }

      if (allSubEntriesValid && tempParsed.length > 0) {
        parsedLines.push(...tempParsed);
        i++;
        continue;
      }
    }

    // Check if line starts an unclosed multi-line quote
    let exportPrefix = false;
    let checkLine = trimmed;
    if (checkLine.startsWith('export ')) {
      exportPrefix = true;
      checkLine = checkLine.slice(7).trim();
    }

    const equalsIdx = checkLine.indexOf('=');
    const colonIdx = checkLine.indexOf(':');
    let separatorIdx = -1;
    let format: 'dotenv' | 'json' | 'yaml' = 'dotenv';

    if (equalsIdx !== -1 && (colonIdx === -1 || equalsIdx < colonIdx)) {
      separatorIdx = equalsIdx;
      format = 'dotenv';
    } else if (colonIdx !== -1) {
      separatorIdx = colonIdx;
      format = checkLine.startsWith('"') || checkLine.startsWith("'") ? 'json' : 'yaml';
    }

    if (separatorIdx !== -1) {
      let rawKey = checkLine.slice(0, separatorIdx).trim();
      if (
        (rawKey.startsWith('"') && rawKey.endsWith('"')) ||
        (rawKey.startsWith("'") && rawKey.endsWith("'"))
      ) {
        rawKey = rawKey.slice(1, -1).trim();
      }

      const valPart = checkLine.slice(separatorIdx + 1).trim();
      const firstChar = valPart[0];

      if (VALID_KEY_REGEX.test(rawKey) && (firstChar === '"' || firstChar === "'")) {
        const quoted = extractQuotedValue(valPart, firstChar);

        // If quote is NOT closed on this line, consume subsequent lines
        if (!quoted.isClosed) {
          const rawAccumulator: string[] = [rawLine];
          let accumulatedVal = quoted.value;
          let isMultiClosed = false;
          let trailingComment: string | undefined = undefined;
          i++;

          while (i < rawLines.length) {
            const nextRaw = rawLines[i];
            rawAccumulator.push(nextRaw);

            // Check if this line contains the closing quote
            const nextQuoted = extractQuotedValue(firstChar + nextRaw, firstChar);
            if (nextQuoted.isClosed) {
              accumulatedVal += '\n' + nextQuoted.value;
              isMultiClosed = true;

              let remainder = nextQuoted.remainder.trim();
              if (format === 'json' && remainder.startsWith(',')) {
                remainder = remainder.slice(1).trim();
              }
              if (remainder.startsWith('#')) {
                trailingComment = remainder.slice(1).trim();
              }
              break;
            } else {
              accumulatedVal += '\n' + nextRaw;
              i++;
            }
          }

          if (isMultiClosed) {
            parsedLines.push({
              kind: 'entry',
              raw: rawAccumulator.join('\n'),
              key: rawKey,
              value: accumulatedVal,
              exportPrefix,
              trailingComment,
              sourceFormat: format,
            });
            i++;
            continue;
          } else {
            // Unclosed quote EOF, fallback to raw lines parsed individually
            for (const r of rawAccumulator) {
              parsedLines.push(parseLine(r));
            }
            i++;
            continue;
          }
        }
      }
    }

    // Normal line parsing
    parsedLines.push(parseLine(rawLine));
    i++;
  }

  // STEP 5: Mark duplicate keys
  const keyCounts = new Map<string, number>();
  for (const line of parsedLines) {
    if (line.kind === 'entry') {
      keyCounts.set(line.key, (keyCounts.get(line.key) || 0) + 1);
    }
  }

  for (const line of parsedLines) {
    if (line.kind === 'entry') {
      const count = keyCounts.get(line.key) || 0;
      line.isDuplicate = count > 1;
    }
  }

  return parsedLines;
}
