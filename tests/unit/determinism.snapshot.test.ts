import { describe, it, expect } from 'vitest';
import { useStore } from '../../src/state/store';
import { listAllTokenEntries } from '../../src/domain/tokens/derived';
import { stableStringify } from '../../src/domain/hash/stableStringify';

// Determinism snapshot: generating the combined token + virtual token list twice without mutation yields same serialized hashable payload.

describe('Determinism: combined tokens snapshot', () => {
  it('produces identical snapshot back-to-back', () => {
    useStore.getState().createProject('Determinism');
    const state = useStore.getState();
    // Add some tokens to widen surface
    state.addToken('colors','brand','#ffffff');
    state.addToken('spacing','md','16px');
    state.addToken('radii','sm','2px');

    const entriesA = listAllTokenEntries(useStore.getState().currentProject!);
    const entriesB = listAllTokenEntries(useStore.getState().currentProject!);
    const snapA = stableStringify(entriesA);
    const snapB = stableStringify(entriesB);
    expect(snapA).toBe(snapB);
  });

  it('updates deterministically after scale change', () => {
    const state = useStore.getState();
    state.updateTypeScale({ ratio: 1.2 });
    const proj = state.currentProject!;
    const entries1 = listAllTokenEntries(proj);
    const entries2 = listAllTokenEntries(proj);
    expect(stableStringify(entries1)).toBe(stableStringify(entries2));
  });
});
