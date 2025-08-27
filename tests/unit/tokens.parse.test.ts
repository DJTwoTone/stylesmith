import { describe, it, expect } from 'vitest';
import { parseTokenBatch } from '../../src/domain/tokens/parse';

const sample = `// colors
--brand-primary: #ff00ff;
--brand-accent: #00ffcc;
--bad name: #000; // invalid name
--dup: #111111;
--dup: #222222;`;

describe('parseTokenBatch', () => {
  it('parses valid lines and reports errors', () => {
    const res = parseTokenBatch('colors', sample);
    expect(res.ok).toBe(false);
    expect(Object.keys(res.entries)).toContain('brand-primary');
    expect(res.errors.length).toBeGreaterThan(0);
    const duplicateErrLine = res.lines.find(l => l.name === 'dup' && l.errors);
    expect(duplicateErrLine?.errors?.some(e => e.code === 'batch_conflict')).toBe(true);
  });
  it('accepts simplified form without leading --', () => {
    const txt = `primary: #fff;\nsecondary: #000;`;
    const res = parseTokenBatch('colors', txt);
    expect(res.ok).toBe(true);
    expect(res.entries.primary).toBe('#fff');
  });
});
