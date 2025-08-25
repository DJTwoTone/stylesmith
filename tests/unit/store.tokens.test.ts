import { describe, it, expect } from 'vitest';
import { useStore } from '../../src/state/store';

// Helper to access underlying state synchronously
function getState() { return useStore.getState(); }

describe('Token store (WP-01)', () => {
  it('creates project and adds token', () => {
    getState().createProject('Test');
    const res = getState().addToken('colors', 'primary', '#ffffff');
    expect(res.ok).toBe(true);
    expect(getState().currentProject?.tokens.colors.primary).toBe('#ffffff');
  });
  it('prevents duplicate names', () => {
    const res = getState().addToken('colors', 'primary', '#000000');
    expect(res.ok).toBe(false);
    expect(res.errors).toContain('Duplicate name');
  });
  it('validates bad name', () => {
    const res = getState().addToken('colors', '1bad', '#111111');
    expect(res.ok).toBe(false);
  });
  it('updates token', () => {
    const res = getState().updateToken('colors', 'primary', '#eeeeee');
    expect(res.ok).toBe(true);
    expect(getState().currentProject?.tokens.colors.primary).toBe('#eeeeee');
  });
  it('deletes token', () => {
    getState().deleteToken('colors', 'primary');
    expect(getState().currentProject?.tokens.colors.primary).toBeUndefined();
  });
});
