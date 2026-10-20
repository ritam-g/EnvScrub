import { describe, it, expect } from 'vitest';
import { scrub } from './scrub';
import type { ParsedLine, ScrubOptions } from '../types';

describe('scrub', () => {
  const sampleLines: ParsedLine[] = [
    {
      kind: 'entry',
      raw: 'PORT=3000',
      key: 'PORT',
      value: '3000',
      exportPrefix: false,
      sourceFormat: 'dotenv',
    },
    {
      kind: 'entry',
      raw: 'API_KEY="supersecret"',
      key: 'API_KEY',
      value: 'supersecret',
      exportPrefix: false,
      sourceFormat: 'dotenv',
    },
    {
      kind: 'comment',
      raw: '# Comments preserved',
    },
    {
      kind: 'blank',
      raw: '',
    },
    {
      kind: 'unparsed',
      raw: 'some unparsed line',
    },
  ];

  it('removes all values in global sanitize mode (keepValues: false)', () => {
    const options: ScrubOptions = {
      keepValues: false,
      overrides: {},
      spacing: 'tight',
    };

    const result = scrub(sampleLines, options);
    expect(result.lines[0]).toEqual({
      kind: 'entry',
      key: 'PORT',
      value: '',
      exportPrefix: false,
      trailingComment: undefined,
      isRemoved: true,
      isDuplicate: undefined,
    });
    expect(result.lines[1]).toEqual({
      kind: 'entry',
      key: 'API_KEY',
      value: '',
      exportPrefix: false,
      trailingComment: undefined,
      isRemoved: true,
      isDuplicate: undefined,
    });
    expect(result.stats.removedValues).toBe(2);
    expect(result.stats.keptValues).toBe(0);
  });

  it('retains all values in global keep mode (keepValues: true)', () => {
    const options: ScrubOptions = {
      keepValues: true,
      overrides: {},
      spacing: 'tight',
    };

    const result = scrub(sampleLines, options);
    expect(result.lines[0]).toEqual({
      kind: 'entry',
      key: 'PORT',
      value: '3000',
      exportPrefix: false,
      trailingComment: undefined,
      isRemoved: false,
      isDuplicate: undefined,
    });
    expect(result.lines[1]).toEqual({
      kind: 'entry',
      key: 'API_KEY',
      value: 'supersecret',
      exportPrefix: false,
      trailingComment: undefined,
      isRemoved: false,
      isDuplicate: undefined,
    });
    expect(result.stats.removedValues).toBe(0);
    expect(result.stats.keptValues).toBe(2);
  });

  it('respects per-key overrides over the global switch', () => {
    const options: ScrubOptions = {
      keepValues: false,
      overrides: {
        PORT: 'keep', // override PORT to keep value even when global is false
      },
      spacing: 'tight',
    };

    const result = scrub(sampleLines, options);
    expect(result.lines[0]).toMatchObject({
      key: 'PORT',
      value: '3000',
      isRemoved: false,
    });
    expect(result.lines[1]).toMatchObject({
      key: 'API_KEY',
      value: '',
      isRemoved: true,
    });
    expect(result.stats.keptValues).toBe(1);
    expect(result.stats.removedValues).toBe(1);
  });

  it('computes accurate document stats', () => {
    const options: ScrubOptions = {
      keepValues: false,
      overrides: {},
      spacing: 'tight',
    };

    const result = scrub(sampleLines, options);
    expect(result.stats).toEqual({
      totalKeys: 2,
      uniqueKeys: 2,
      removedValues: 2,
      keptValues: 0,
      unparsedLines: 1,
      duplicateKeys: 0,
      sensitiveKeysCount: 1, // API_KEY
    });
  });
});
