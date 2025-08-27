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
    expect(res.errors?.some(e => e.code === 'duplicate_name')).toBe(true);
  });
  it('validates bad name', () => {
    const res = getState().addToken('colors', '1bad', '#111111');
    expect(res.ok).toBe(false);
    expect(res.errors?.some(e => e.code === 'invalid_name')).toBe(true);
  });
  it('updates token', () => {
    const res = getState().updateToken('colors', 'primary', '#eeeeee');
    expect(res.ok).toBe(true);
    expect(getState().currentProject?.tokens.colors.primary).toBe('#eeeeee');
  });
  it('renames token', () => {
    const res = getState().renameToken('colors', 'primary', 'brand-primary');
    expect(res.ok).toBe(true);
    expect(getState().currentProject?.tokens.colors['brand-primary']).toBeDefined();
    expect(getState().currentProject?.tokens.colors['primary']).toBeUndefined();
  });
  it('rejects duplicate rename', () => {
    // add a second token then attempt rename collision
    getState().addToken('colors', 'accent', '#123123');
    const res = getState().renameToken('colors', 'accent', 'brand-primary');
    expect(res.ok).toBe(false);
    expect(res.errors?.some(e => e.code === 'duplicate_name')).toBe(true);
  });
  it('batch adds tokens atomically', () => {
    const beforeCount = Object.keys(getState().currentProject!.tokens.spacing).length;
    const ok = getState().batchAddTokens('spacing', { sm: '4px', md: '8px' });
    expect(ok.ok).toBe(true);
    expect(Object.keys(getState().currentProject!.tokens.spacing).length).toBe(beforeCount + 2);
    const fail = getState().batchAddTokens('spacing', { sm: 'badunit', lg: '16px' });
    expect(fail.ok).toBe(false);
    // ensure no partial application (lg shouldn't appear)
    expect(getState().currentProject!.tokens.spacing.lg).toBeUndefined();
  });
  it('sets prefix', () => {
    getState().setPrefix('acme');
    expect(getState().currentProject?.prefix).toBe('acme');
  });
  it('deletes token', () => {
    getState().deleteToken('colors', 'primary');
    expect(getState().currentProject?.tokens.colors.primary).toBeUndefined();
  });
});
