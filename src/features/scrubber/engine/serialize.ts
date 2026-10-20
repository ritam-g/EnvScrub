import type { ScrubbedLine } from '../types';

/**
 * Serializes scrubbed lines back into a clean string representation.
 *
 * STEP 1: Process each line, preserving blanks, comments, and unparsed lines untouched.
 * STEP 2: Format entries according to the chosen spacing ('tight': KEY=value, 'spaced': KEY =value).
 * STEP 3: Re-apply 'export ' prefix and inline comments if present.
 * STEP 4: Ensure multi-line values retain proper quoting to remain valid .env syntax.
 * STEP 5: Join lines with standard newline characters.
 */
export function serialize(lines: ScrubbedLine[], spacing: 'tight' | 'spaced' = 'tight'): string {
  const resultLines: string[] = [];
  const separator = spacing === 'spaced' ? ' =' : '=';

  for (const line of lines) {
    if (line.kind === 'blank' || line.kind === 'comment' || line.kind === 'unparsed') {
      resultLines.push(line.raw);
      continue;
    }

    const prefix = line.exportPrefix ? 'export ' : '';
    let valPart = line.value;

    // Multi-line values require quotes to stay valid in .env files
    if (valPart.includes('\n')) {
      valPart = `"${valPart}"`;
    }

    let lineStr = `${prefix}${line.key}${separator}${valPart}`;

    if (line.trailingComment !== undefined) {
      lineStr += ` # ${line.trailingComment}`;
    }

    resultLines.push(lineStr);
  }

  return resultLines.join('\n');
}
