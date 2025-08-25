import { describe, it, expect } from 'vitest';
import { sha256 } from '../../src/domain/hash/hash';

describe('sha256', () => {
  it('produces a stable hash', async () => {
    const h1 = await sha256('abc');
    const h2 = await sha256('abc');
    expect(h1).toEqual(h2);
    expect(h1).toMatch(/^[0-9a-f]{64}$/);
  });
});
