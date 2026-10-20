import { describe, it, expect } from 'vitest';
import { isSensitiveKey, getSmartOverrides } from './sensitiveKeys';
import type { ParsedLine } from '../types';

describe('sensitiveKeys', () => {
  it('detects sensitive keys case-insensitively', () => {
    expect(isSensitiveKey('API_KEY')).toBe(true);
    expect(isSensitiveKey('gemin_api_key')).toBe(true);
    expect(isSensitiveKey('DB_PASSWORD')).toBe(true);
    expect(isSensitiveKey('AUTH_TOKEN')).toBe(true);
    expect(isSensitiveKey('APP_SECRET')).toBe(true);
    expect(isSensitiveKey('PRIVATE_KEY')).toBe(true);
    expect(isSensitiveKey('DATABASE_URI')).toBe(true);
    expect(isSensitiveKey('REDIS_CONNECTION_STRING')).toBe(true);
    expect(isSensitiveKey('SENTRY_DSN')).toBe(true);
    expect(isSensitiveKey('ADMIN_PWD')).toBe(true);
    expect(isSensitiveKey('AWS_CREDENTIALS')).toBe(true);
  });

  it('recognizes non-sensitive keys', () => {
    expect(isSensitiveKey('PORT')).toBe(false);
    expect(isSensitiveKey('NODE_ENV')).toBe(false);
    expect(isSensitiveKey('HOST')).toBe(false);
    expect(isSensitiveKey('APP_NAME')).toBe(false);
    expect(isSensitiveKey('DEBUG')).toBe(false);
    expect(isSensitiveKey('')).toBe(false);
  });

  it('generates smart overrides correctly', () => {
    const lines: ParsedLine[] = [
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
        raw: 'API_KEY=secret123',
        key: 'API_KEY',
        value: 'secret123',
        exportPrefix: false,
        sourceFormat: 'dotenv',
      },
      {
        kind: 'comment',
        raw: '# comment',
      },
    ];

    const overrides = getSmartOverrides(lines);
    expect(overrides).toEqual({
      PORT: 'keep',
      API_KEY: 'remove',
    });
  });
});
