import { describe, it, expect } from 'vitest';
import { parseLine } from './parseLine';

describe('parseLine', () => {
  it('parses blank lines correctly', () => {
    expect(parseLine('')).toEqual({ kind: 'blank', raw: '' });
    expect(parseLine('   ')).toEqual({ kind: 'blank', raw: '   ' });
  });

  it('parses comment lines correctly', () => {
    expect(parseLine('# Database configuration')).toEqual({
      kind: 'comment',
      raw: '# Database configuration',
    });
    expect(parseLine('  # Indented comment')).toEqual({
      kind: 'comment',
      raw: '  # Indented comment',
    });
  });

  it('parses plain and spaced dotenv formats', () => {
    const res1 = parseLine('PORT=3000');
    expect(res1).toEqual({
      kind: 'entry',
      raw: 'PORT=3000',
      key: 'PORT',
      value: '3000',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });

    const res2 = parseLine('PORT = 3000');
    expect(res2).toEqual({
      kind: 'entry',
      raw: 'PORT = 3000',
      key: 'PORT',
      value: '3000',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });
  });

  it('parses double and single quoted values, stripping outer quotes', () => {
    const resDouble = parseLine('DATABASE_URL="postgres://user:pass@host/db"');
    expect(resDouble).toEqual({
      kind: 'entry',
      raw: 'DATABASE_URL="postgres://user:pass@host/db"',
      key: 'DATABASE_URL',
      value: 'postgres://user:pass@host/db',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });

    const resSingle = parseLine("SECRET='my-secret-token'");
    expect(resSingle).toEqual({
      kind: 'entry',
      raw: "SECRET='my-secret-token'",
      key: 'SECRET',
      value: 'my-secret-token',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });
  });

  it('parses export prefix and keeps exportPrefix flag', () => {
    const res = parseLine('export APP_ENV=production');
    expect(res).toEqual({
      kind: 'entry',
      raw: 'export APP_ENV=production',
      key: 'APP_ENV',
      value: 'production',
      exportPrefix: true,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });
  });

  it('parses DevOps JSON lines with trailing commas and padded keys', () => {
    const res1 = parseLine('"gemin_api_key ": "088w9eoundn"');
    expect(res1).toEqual({
      kind: 'entry',
      raw: '"gemin_api_key ": "088w9eoundn"',
      key: 'gemin_api_key',
      value: '088w9eoundn',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'json',
    });

    const res2 = parseLine('"PORT": 5000,');
    expect(res2).toEqual({
      kind: 'entry',
      raw: '"PORT": 5000,',
      key: 'PORT',
      value: '5000',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'json',
    });

    const res3 = parseLine('"DEBUG": true,');
    expect(res3).toEqual({
      kind: 'entry',
      raw: '"DEBUG": true,',
      key: 'DEBUG',
      value: 'true',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'json',
    });
  });

  it('parses YAML-like syntax', () => {
    const res = parseLine('HOST: localhost');
    expect(res).toEqual({
      kind: 'entry',
      raw: 'HOST: localhost',
      key: 'HOST',
      value: 'localhost',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'yaml',
    });
  });

  it('handles multiple separators KEY=a=b=c', () => {
    const res = parseLine('KEY=a=b=c');
    expect(res).toEqual({
      kind: 'entry',
      raw: 'KEY=a=b=c',
      key: 'KEY',
      value: 'a=b=c',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });
  });

  it('handles values containing # in quotes vs inline comments', () => {
    const quoted = parseLine('KEY="a # b"');
    expect(quoted).toEqual({
      kind: 'entry',
      raw: 'KEY="a # b"',
      key: 'KEY',
      value: 'a # b',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
    });

    const unquotedWithComment = parseLine('KEY=a # note');
    expect(unquotedWithComment).toEqual({
      kind: 'entry',
      raw: 'KEY=a # note',
      key: 'KEY',
      value: 'a',
      exportPrefix: false,
      trailingComment: 'note',
      sourceFormat: 'dotenv',
    });
  });

  it('treats invalid lines as unparsed', () => {
    expect(parseLine('invalid line with no separator')).toEqual({
      kind: 'unparsed',
      raw: 'invalid line with no separator',
    });
    expect(parseLine('123_INVALID=value')).toEqual({
      kind: 'unparsed',
      raw: '123_INVALID=value',
    });
    expect(parseLine('{')).toEqual({
      kind: 'unparsed',
      raw: '{',
    });
  });
});
