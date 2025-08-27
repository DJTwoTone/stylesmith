import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/state/store';
import { ensureProject } from '../utils/storeTestUtils';
import { generateUtilities } from '../../src/domain/utilities/generate';

function initProject() {
  // Ensure a project exists; fetch fresh state after mutation for updated reference
  useStore.getState().createProject('Utils');
  return useStore.getState();
}

beforeEach(() => {
  if (!useStore.getState().currentProject) initProject();
  ensureProject('Utils');
});

describe('Utilities Generation (fontSize family)', () => {
  it('generates deterministic font size classes', () => {
  const s = initProject();
  const proj = s.currentProject!; // guaranteed by initProject
    const outA = generateUtilities(proj);
    const outB = generateUtilities(proj);
    expect(outA.concatenated).toBe(outB.concatenated);
    expect(outA.totalClasses).toBeGreaterThan(0);
    expect(outA.concatenated).toMatch(/\.text-0/);
  });
  it('reflects scale ratio change deterministically', () => {
    const s = useStore.getState();
    s.updateTypeScale({ ratio: 1.2 });
    const out1 = generateUtilities(s.currentProject!);
    const out2 = generateUtilities(s.currentProject!);
    expect(out1.concatenated).toBe(out2.concatenated);
  });
  it('generates spacing utilities deterministically after adding spacing tokens', () => {
    const s = useStore.getState();
    s.addToken('spacing', 'sm', '4px');
    s.addToken('spacing', 'md', '8px');
  const projAfter = useStore.getState().currentProject!;
  const outA = generateUtilities(projAfter);
  const outB = generateUtilities(useStore.getState().currentProject!);
    expect(outA.concatenated).toContain('.m-sm{margin:4px;}');
    expect(outA.concatenated).toContain('.p-md{padding:8px;}');
    expect(outA.concatenated).toBe(outB.concatenated);
  // Adding another spacing token should re-sort alphabetically (deterministic ordering)
    s.addToken('spacing', 'lg', '16px');
  const outC = generateUtilities(useStore.getState().currentProject!);
  const idxLg = outC.concatenated.indexOf('.m-lg{margin:16px;}');
  const idxMd = outC.concatenated.indexOf('.m-md{margin:8px;}');
  const idxSm = outC.concatenated.indexOf('.m-sm{margin:4px;}');
  expect(idxLg).toBeGreaterThan(-1);
  expect(idxMd).toBeGreaterThan(-1);
  expect(idxSm).toBeGreaterThan(-1);
  // Alphabetical ordering: lg < md < sm so indices should reflect that
  expect(idxLg).toBeLessThan(idxMd);
  expect(idxMd).toBeLessThan(idxSm);
  });
  it('generates color utilities deterministically after adding color tokens', () => {
    const s = useStore.getState();
    s.addToken('colors', 'primary', '#ff0000');
    s.addToken('colors', 'accent', '#00ff00');
    const out1 = generateUtilities(useStore.getState().currentProject!);
    const out2 = generateUtilities(useStore.getState().currentProject!);
    expect(out1.concatenated).toContain('.text-accent{color:#00ff00;}');
    expect(out1.concatenated).toContain('.bg-primary{background-color:#ff0000;}');
    expect(out1.concatenated).toBe(out2.concatenated);
    // Ensure alphabetical (accent before primary)
    const idxAccent = out1.concatenated.indexOf('.text-accent{color:#00ff00;}');
    const idxPrimary = out1.concatenated.indexOf('.text-primary{color:#ff0000;}');
    expect(idxAccent).toBeGreaterThan(-1);
    expect(idxPrimary).toBeGreaterThan(-1);
    expect(idxAccent).toBeLessThan(idxPrimary);
  });
});
