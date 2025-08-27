import { describe, it, expect } from 'vitest';
import { useStore } from '../../src/state/store';
import { listAllTokenEntries, getFontSizeVirtualTokens } from '../../src/domain/tokens/derived';

function s(){ return useStore.getState(); }

describe('Derived Tokens (Typography virtual font sizes)', () => {
  it('produces virtual font size tokens deterministically', () => {
    s().createProject('Derived');
    const proj = s().currentProject!;
    const virtualA = getFontSizeVirtualTokens(proj);
    const virtualB = getFontSizeVirtualTokens(proj);
    expect(JSON.stringify(virtualA)).toBe(JSON.stringify(virtualB));
  });
  it('includes virtual tokens in aggregated list sorted', () => {
    const proj = s().currentProject!;
    const all = listAllTokenEntries(proj);
    const fontTokens = all.filter(e=> e.category === 'fontSizes');
    expect(fontTokens.length).toBeGreaterThan(0);
    // Ensure sorted order
    const names = fontTokens.map(f=>f.name);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });
});
