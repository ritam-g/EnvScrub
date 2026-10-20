import { describe, it, expect } from 'vitest';
import { parseDocument } from './parseDocument';

describe('parseDocument', () => {
  it('safely handles leading UTF-8 BOM and Windows CRLF endings', () => {
    const input = '\uFEFFPORT=3000\r\nHOST=localhost\r\n';
    const lines = parseDocument(input);

    expect(lines).toHaveLength(3); // PORT, HOST, and blank trailing line
    expect(lines[0]).toMatchObject({
      kind: 'entry',
      key: 'PORT',
      value: '3000',
    });
    expect(lines[1]).toMatchObject({
      kind: 'entry',
      key: 'HOST',
      value: 'localhost',
    });
    expect(lines[2]).toMatchObject({
      kind: 'blank',
      raw: '',
    });
  });

  it('treats multi-line quoted values (e.g. private keys) as a single entry', () => {
    const pem = `KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0
-----END RSA PRIVATE KEY-----"`;

    const lines = parseDocument(pem);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toEqual({
      kind: 'entry',
      raw: pem,
      key: 'KEY',
      value: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0\n-----END RSA PRIVATE KEY-----',
      exportPrefix: false,
      trailingComment: undefined,
      sourceFormat: 'dotenv',
      isDuplicate: false,
    });
  });

  it('detects duplicate keys and marks all occurrences as duplicates', () => {
    const input = `FOO=first
BAR=unique
FOO=second`;

    const lines = parseDocument(input);
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatchObject({ key: 'FOO', isDuplicate: true });
    expect(lines[1]).toMatchObject({ key: 'BAR', isDuplicate: false });
    expect(lines[2]).toMatchObject({ key: 'FOO', isDuplicate: true });
  });

  it('expands a full single-line JSON object into entries', () => {
    const input = '{ "KEY": "value", "PORT": 5000, "DEBUG": true }';
    const lines = parseDocument(input);

    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatchObject({
      kind: 'entry',
      key: 'KEY',
      value: 'value',
      sourceFormat: 'json',
    });
    expect(lines[1]).toMatchObject({
      kind: 'entry',
      key: 'PORT',
      value: '5000',
      sourceFormat: 'json',
    });
    expect(lines[2]).toMatchObject({
      kind: 'entry',
      key: 'DEBUG',
      value: 'true',
      sourceFormat: 'json',
    });
  });

  it('preserves blank lines and comments in their original locations', () => {
    const input = `# Server config

PORT=8080
# End server config`;

    const lines = parseDocument(input);
    expect(lines).toHaveLength(4);
    expect(lines[0]).toEqual({ kind: 'comment', raw: '# Server config' });
    expect(lines[1]).toEqual({ kind: 'blank', raw: '' });
    expect(lines[2]).toMatchObject({ kind: 'entry', key: 'PORT', value: '8080' });
    expect(lines[3]).toEqual({ kind: 'comment', raw: '# End server config' });
  });
});
