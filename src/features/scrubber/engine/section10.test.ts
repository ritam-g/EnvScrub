import { describe, it, expect } from 'vitest';
import { parseDocument, scrub, serialize } from './index';

/**
 * End-to-end verification of all mandatory test cases specified in Section 10 of the brief.
 */
describe('Section 10 Comprehensive Engine Test Cases', () => {
  it('1. Passes the Section 3 examples in Sanitize mode (Keep values OFF)', () => {
    // Spaced mode (as shown in brief example)
    const input = `gemin_api_key = 3937294djflsn fj;jf
gemin_api_key = "3937294djflsn fj;jf"
"gemin_api_key ": "088w9eoundn"`;

    const parsed = parseDocument(input);
    const scrubbed = scrub(parsed, { keepValues: false, overrides: {}, spacing: 'spaced' });
    const output = serialize(scrubbed.lines, 'spaced');

    const expected = `gemin_api_key =
gemin_api_key =
gemin_api_key =`;
    expect(output).toBe(expected);

    // Tight mode
    const scrubbedTight = scrub(parsed, { keepValues: false, overrides: {}, spacing: 'tight' });
    const outputTight = serialize(scrubbedTight.lines, 'tight');
    const expectedTight = `gemin_api_key=
gemin_api_key=
gemin_api_key=`;
    expect(outputTight).toBe(expectedTight);
  });

  it('2. Passes the Section 3 examples in Keep mode (Keep values ON)', () => {
    const input = `"gemin_api_key ": "088w9eoundn"
gemin_api_key = "3937294djflsn fj;jf"`;

    const parsed = parseDocument(input);

    // Spaced mode
    const scrubbedSpaced = scrub(parsed, { keepValues: true, overrides: {}, spacing: 'spaced' });
    const outputSpaced = serialize(scrubbedSpaced.lines, 'spaced');
    expect(outputSpaced).toBe(`gemin_api_key =088w9eoundn\ngemin_api_key =3937294djflsn fj;jf`);

    // Tight mode
    const scrubbedTight = scrub(parsed, { keepValues: true, overrides: {}, spacing: 'tight' });
    const outputTight = serialize(scrubbedTight.lines, 'tight');
    expect(outputTight).toBe(`gemin_api_key=088w9eoundn\ngemin_api_key=3937294djflsn fj;jf`);
  });

  it('3. KEY=a=b=c keeps a=b=c as the value', () => {
    const parsed = parseDocument('KEY=a=b=c');
    expect(parsed[0]).toMatchObject({ key: 'KEY', value: 'a=b=c' });
    const scrubbed = scrub(parsed, { keepValues: true, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbed.lines, 'tight')).toBe('KEY=a=b=c');
  });

  it('4. KEY="a # b" keeps "a # b", and KEY=a # note gives value "a" with trailing comment "note"', () => {
    const parsed1 = parseDocument('KEY="a # b"');
    expect(parsed1[0]).toMatchObject({ key: 'KEY', value: 'a # b', trailingComment: undefined });

    const parsed2 = parseDocument('KEY=a # note');
    expect(parsed2[0]).toMatchObject({ key: 'KEY', value: 'a', trailingComment: 'note' });

    const scrubbed = scrub(parsed2, { keepValues: true, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbed.lines, 'tight')).toBe('KEY=a # note');
  });

  it('5. Handles single quotes, double quotes, no quotes, and export KEY=value', () => {
    const input = `SINGLE='val1'
DOUBLE="val2"
PLAIN=val3
export EXPORTED=val4`;

    const parsed = parseDocument(input);
    const scrubbedKeep = scrub(parsed, { keepValues: true, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbedKeep.lines, 'tight')).toBe(`SINGLE=val1
DOUBLE=val2
PLAIN=val3
export EXPORTED=val4`);

    const scrubbedSanitize = scrub(parsed, { keepValues: false, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbedSanitize.lines, 'tight')).toBe(`SINGLE=
DOUBLE=
PLAIN=
export EXPORTED=`);
  });

  it('6. Handles DevOps JSON line with trailing comma and full JSON object', () => {
    const jsonLines = `"KEY": "value",
"PORT": 5000,`;
    const parsedLines = parseDocument(jsonLines);
    expect(parsedLines).toHaveLength(2);
    expect(parsedLines[0]).toMatchObject({ key: 'KEY', value: 'value' });
    expect(parsedLines[1]).toMatchObject({ key: 'PORT', value: '5000' });

    const fullJson = '{ "KEY": "value", "PORT": 5000, "IS_ACTIVE": true }';
    const parsedFull = parseDocument(fullJson);
    expect(parsedFull).toHaveLength(3);
    expect(parsedFull[0]).toMatchObject({ key: 'KEY', value: 'value' });
    expect(parsedFull[1]).toMatchObject({ key: 'PORT', value: '5000' });
    expect(parsedFull[2]).toMatchObject({ key: 'IS_ACTIVE', value: 'true' });
  });

  it('7. Handles YAML KEY: value', () => {
    const parsed = parseDocument('DATABASE_HOST: localhost');
    expect(parsed[0]).toMatchObject({
      kind: 'entry',
      key: 'DATABASE_HOST',
      value: 'localhost',
      sourceFormat: 'yaml',
    });
  });

  it('8. Preserves comments and blank lines unchanged in their exact position', () => {
    const input = `# Header comment

KEY1=value1
# Section divider
KEY2=value2

# Footer`;
    const parsed = parseDocument(input);
    const scrubbed = scrub(parsed, { keepValues: true, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbed.lines, 'tight')).toBe(input);
  });

  it('9. Treats multi-line quoted private key as a single entry', () => {
    const pem = `PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0Y16
-----END RSA PRIVATE KEY-----"`;

    const parsed = parseDocument(pem);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      kind: 'entry',
      key: 'PRIVATE_KEY',
      value: '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Y16\n-----END RSA PRIVATE KEY-----',
    });

    const scrubbedSanitize = scrub(parsed, { keepValues: false, overrides: {}, spacing: 'tight' });
    expect(serialize(scrubbedSanitize.lines, 'tight')).toBe('PRIVATE_KEY=');
  });

  it('10. Safely handles CRLF endings and leading UTF-8 BOM', () => {
    const input = '\uFEFFKEY1=val1\r\nKEY2=val2\r\n';
    const parsed = parseDocument(input);
    expect(parsed[0]).toMatchObject({ key: 'KEY1', value: 'val1' });
    expect(parsed[1]).toMatchObject({ key: 'KEY2', value: 'val2' });
  });

  it('11. Retains and flags duplicate keys', () => {
    const input = `KEY=first
KEY=second`;
    const parsed = parseDocument(input);
    expect(parsed[0].kind === 'entry' && parsed[0].isDuplicate).toBe(true);
    expect(parsed[1].kind === 'entry' && parsed[1].isDuplicate).toBe(true);
  });

  it('12. Passes garbage lines through as unparsed without dropping them', () => {
    const input = `VALID_KEY=test
>>> syntax error in devops dump <<<
ANOTHER_KEY=123`;

    const parsed = parseDocument(input);
    expect(parsed).toHaveLength(3);
    expect(parsed[1]).toEqual({
      kind: 'unparsed',
      raw: '>>> syntax error in devops dump <<<',
    });

    const scrubbed = scrub(parsed, { keepValues: false, overrides: {}, spacing: 'tight' });
    const output = serialize(scrubbed.lines, 'tight');
    expect(output).toBe('VALID_KEY=\n>>> syntax error in devops dump <<<\nANOTHER_KEY=');
    expect(scrubbed.stats.unparsedLines).toBe(1);
  });

  it('13. Resolves per-key overrides over the global switch', () => {
    const input = `PORT=8080
API_KEY=secret_key`;

    const parsed = parseDocument(input);
    const scrubbed = scrub(parsed, {
      keepValues: false, // global: remove all
      overrides: { PORT: 'keep' }, // override: keep PORT
      spacing: 'tight',
    });

    expect(serialize(scrubbed.lines, 'tight')).toBe('PORT=8080\nAPI_KEY=');
  });

  it('14. Guarantees complete idempotence on scrubbed output', () => {
    const input = SAMPLE_TEXT;
    const pass1 = serialize(
      scrub(parseDocument(input), { keepValues: false, overrides: {}, spacing: 'tight' }).lines,
      'tight'
    );
    const pass2 = serialize(
      scrub(parseDocument(pass1), { keepValues: false, overrides: {}, spacing: 'tight' }).lines,
      'tight'
    );

    expect(pass2).toBe(pass1);
  });
});

const SAMPLE_TEXT = `# Sample config
PORT=3000
SECRET="abc"
export DEBUG=true # inline note
`;
