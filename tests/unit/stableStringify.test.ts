import { describe, it, expect } from 'vitest';
import { stableStringify } from '../../src/domain/hash/stableStringify';

describe('stableStringify', () => {
  it('sorts object keys recursively', () => {
    const a = { b: 2, a: { z: 1, c: 3 } };
    const b = { a: { c: 3, z: 1 }, b: 2 };
    expect(stableStringify(a)).toEqual(stableStringify(b));
  });
});
