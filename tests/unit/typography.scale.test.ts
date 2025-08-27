import { describe, it, expect } from 'vitest';
import { generateTypeScale, defaultHeadingsMap, validateHeadingsMap, type HeadingsMap } from '../../src/domain/typography/scale';

describe('Typography Scale (WP-02)', () => {
  it('generates modular scale steps deterministically', () => {
    const steps = generateTypeScale({ base: 16, ratio: 1.25 });
    expect(steps.length).toBeGreaterThan(0);
    // snapshot critical first & last values for determinism
  expect(steps[0].px).toBeCloseTo(16 * Math.pow(1.25, -2), 4);
  expect(steps[steps.length - 1].px).toBeCloseTo(16 * Math.pow(1.25, 4), 4);
  });
  it('respects presets override', () => {
    const steps = generateTypeScale({ base: 16, ratio: 1.2, presets: [12,14,16,20] });
    expect(steps.map(s=>s.px)).toEqual([12,14,16,20]);
  });
  it('default headings map chooses descending sizes', () => {
    const steps = generateTypeScale({ base: 16, ratio: 1.25 });
    const map = defaultHeadingsMap(steps);
    expect(map.h1).not.toBe(map.h6);
  });
  it('validates headings map references', () => {
    const steps = generateTypeScale({ base: 16, ratio: 1.25 });
    const tokens = steps.map(s=>s.name);
  const map: HeadingsMap = { h1: tokens[0], h2: tokens[1], h3: 'missing', h4: tokens[2], h5: tokens[3], h6: tokens[4] };
    const res = validateHeadingsMap(map, tokens);
    expect(res.ok).toBe(false);
    expect(res.errors?.some(e=>e.level==='h3')).toBe(true);
  });
});
