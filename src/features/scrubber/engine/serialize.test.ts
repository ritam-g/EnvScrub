import { describe, it, expect } from 'vitest';
import { serialize } from './serialize';
import { parseDocument } from './parseDocument';
import { scrub } from './scrub';
import type { ScrubbedLine } from '../types';

describe('serialize', () => {
  it('formats entries with tight spacing (KEY=value / KEY=)', () => {
    const lines: ScrubbedLine[] = [
      {
        kind: 'entry',
        key: 'PORT',
        value: '3000',
        exportPrefix: false,
        isRemoved: false,
      },
      {
        kind: 'entry',
        key: 'SECRET',
        value: '',
        exportPrefix: false,
        isRemoved: true,
      },
    ];

    expect(serialize(lines, 'tight')).toBe('PORT=3000\nSECRET=');
  });

  it('formats entries with spaced option (KEY =value / KEY =)', () => {
    const lines: ScrubbedLine[] = [
      {
        kind: 'entry',
        key: 'PORT',
        value: '3000',
        exportPrefix: false,
        isRemoved: false,
      },
      {
        kind: 'entry',
        key: 'SECRET',
        value: '',
        exportPrefix: false,
        isRemoved: true,
      },
    ];

    expect(serialize(lines, 'spaced')).toBe('PORT =3000\nSECRET =');
  });

  it('preserves export prefix, inline comments, and multi-line formatting', () => {
    const lines: ScrubbedLine[] = [
      {
        kind: 'entry',
        key: 'API_HOST',
        value: 'api.example.com',
        exportPrefix: true,
        trailingComment: 'production endpoint',
        isRemoved: false,
      },
      {
        kind: 'comment',
        raw: '# Section header',
      },
      {
        kind: 'blank',
        raw: '',
      },
      {
        kind: 'entry',
        key: 'RSA_KEY',
        value: 'line1\nline2',
        exportPrefix: false,
        isRemoved: false,
      },
    ];

    const expected =
      'export API_HOST=api.example.com # production endpoint\n# Section header\n\nRSA_KEY="line1\nline2"';
    expect(serialize(lines, 'tight')).toBe(expected);
  });

  it('is completely idempotent (scrubbing output leaves it unchanged)', () => {
    const originalInput = `# Server Environment
PORT=8080
API_KEY="mysecret123"
export DEBUG = false # inline note
`;

    // First pass (Sanitize mode)
    const parsed1 = parseDocument(originalInput);
    const scrubbed1 = scrub(parsed1, { keepValues: false, overrides: {}, spacing: 'tight' });
    const output1 = serialize(scrubbed1.lines, 'tight');

    // Second pass on output1
    const parsed2 = parseDocument(output1);
    const scrubbed2 = scrub(parsed2, { keepValues: false, overrides: {}, spacing: 'tight' });
    const output2 = serialize(scrubbed2.lines, 'tight');

    expect(output2).toBe(output1);
  });
});
