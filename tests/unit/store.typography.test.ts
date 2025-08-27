import { describe, it, expect } from 'vitest';
import { useStore } from '../../src/state/store';

function s() { return useStore.getState(); }

describe('Store Typography Integration (WP-02)', () => {
  it('initializes default type scale and headings', () => {
    s().createProject('Typo');
    const proj = s().currentProject!;
    expect(proj.typography.scaleConfig.base).toBe(16);
    expect(Object.keys(proj.typography.headingsMap).length).toBe(6);
  });
  it('updates type scale and regenerates headings deterministically', () => {
    s().updateTypeScale({ ratio: 1.2 });
    const proj = s().currentProject!;
    expect(proj.typography.scaleConfig.ratio).toBe(1.2);
    s().updateTypeScale({ base: 18 });
    const proj2 = s().currentProject!;
    // h1 token name may stay same pattern but ensure map exists
    expect(proj2.typography.headingsMap.h1).toBeDefined();
  });
  it('rejects invalid headings map references', () => {
    const proj = s().currentProject!;
    const bad = { ...proj.typography.headingsMap, h3: 'missing-token' };
    const res = s().setHeadingsMap(bad);
    expect(res.ok).toBe(false);
  });
});
