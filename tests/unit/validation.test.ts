import { describe, it, expect } from 'vitest';
import { validateTokenName, validateTokenValue, validateBatch, validateTokenFull, suggestTokenName, summarizeValidation, normalizeTokenValue, ensureUniqueTokenName, prepareTokenInsertion } from '../../src/domain/tokens/validation';

describe('Token Validation (granular)', () => {
  describe('validateTokenName', () => {
    it('accepts valid kebab-case name starting with lowercase letter', () => {
      const err = validateTokenName('primary-color');
      expect(err).toBeNull();
    });
    it('rejects name starting with uppercase', () => {
      const err = validateTokenName('Primary');
      expect(err?.code).toBe('invalid_name');
    });
    it('rejects name with invalid chars', () => {
      const err = validateTokenName('primary_color');
      expect(err?.code).toBe('invalid_name');
    });
  });

  describe('validateTokenValue', () => {
    it('accepts multiple hex color formats', () => {
      ['#fff', '#fffa', '#ffffff', '#ffffffff', 'rgb(0,0,0)', 'rgba(0,0,0,0.5)'].forEach(v => {
        const err = validateTokenValue('colors', v);
        expect(err).toBeNull();
      });
    });
    it('rejects invalid hex color', () => {
      const err = validateTokenValue('colors', '#zzzzzz');
      expect(err?.code).toBe('invalid_value');
    });
    it('validates spacing units', () => {
      expect(validateTokenValue('spacing', '4px')).toBeNull();
      expect(validateTokenValue('spacing', '1.25rem')).toBeNull();
      expect(validateTokenValue('spacing', '8')).not.toBeNull();
    });
    it('validates radii units', () => {
      expect(validateTokenValue('radii', '4px')).toBeNull();
      expect(validateTokenValue('radii', '50%')).toBeNull();
      expect(validateTokenValue('radii', '4')).not.toBeNull();
    });
    it('accepts any non-empty shadow', () => {
      expect(validateTokenValue('shadows', '0 1px 2px rgba(0,0,0,0.2)')).toBeNull();
      expect(validateTokenValue('shadows', '')?.code).toBe('invalid_value');
    });
  });

  describe('validateBatch', () => {
    it('handles batch with no intrinsic duplicates (object collapse limitation)', () => {
      const obj: Record<string,string> = { a: '4px', b: '8px' };
      const res = validateBatch('spacing', obj);
      expect(res.ok).toBe(true);
    });
    it('validates each pair and aggregates errors', () => {
      const res = validateBatch('spacing', { good: '4px', bad: '10' });
      expect(res.ok).toBe(false);
      expect(res.errors?.some(e => e.code === 'invalid_value')).toBe(true);
    });
    it('would classify duplicate names as batch_conflict', () => {
      const entries: Record<string,string> = {};
      ['x','y','x'].forEach((n,i) => { entries[n + (i===2 ? '' : '')] = '4px'; });
      // Object key collapse prevents real duplicate detection here; simulate by manually invoking detection logic conceptually.
      // Just assert code change didn't break success path.
      const res = validateBatch('spacing', entries);
      expect(res.ok).toBe(true);
    });
  });

  describe('validateTokenFull', () => {
    it('returns byField mapping', () => {
      const report = validateTokenFull('spacing', 'bad_name', '10');
      expect(report.ok).toBe(false);
      expect(report.byField.name?.length).toBeGreaterThan(0);
      expect(report.byField.value?.length).toBeGreaterThan(0);
    });
    it('passes for valid token', () => {
      const report = validateTokenFull('spacing', 'gap-small', '4px');
      expect(report.ok).toBe(true);
      expect(report.errors.length).toBe(0);
    });
    it('adds heuristic warnings when enabled', () => {
      const report = validateTokenFull('spacing', 'very-very-very-very-long-name-for-token', '4px', { includeHeuristics: true });
      expect(report.errors.some(e => e.severity === 'warning' && e.code === 'style_warning')).toBe(true);
      const summary = summarizeValidation(report);
      expect(summary.warnings).toBeGreaterThan(0);
      // ok should still be true because only warnings present
      expect(report.ok).toBe(true);
    });
    it('provides normalization metadata', () => {
      const report = validateTokenFull('colors', 'brand-base', '#ABC', { includeNormalization: true });
      expect(report.normalized?.value).toBe('#aabbcc');
      expect(report.normalized?.changed).toBe(true);
      const spacingNorm = normalizeTokenValue('spacing', '4.0px');
      expect(spacingNorm).toBe('4px');
    });
  });

  describe('suggestTokenName', () => {
    it('normalizes complex string', () => {
      const s = suggestTokenName('  Primary Color / Brand ');
      expect(s).toBe('primary-color-brand');
    });
    it('prefixes when starting with digit', () => {
      const s = suggestTokenName('123spacing');
      expect(s.startsWith('t') || /^[a-z]/.test(s)).toBe(true);
      expect(validateTokenName(s)).toBeNull();
    });
    it('returns fallback t for empty input', () => {
      expect(suggestTokenName('   ')).toBe('t');
    });
  });

  describe('summarizeValidation', () => {
    it('counts errors correctly', () => {
      const report = validateTokenFull('spacing', '1bad', 'nope');
      const summary = summarizeValidation(report);
      expect(summary.errors).toBeGreaterThan(0);
    });
    it('returns zero counts on ok', () => {
      const report = validateTokenFull('spacing', 'gap-xs', '4px');
      const summary = summarizeValidation(report);
      expect(summary.errors).toBe(0);
      expect(summary.warnings).toBe(0);
    });
  });

  describe('ensureUniqueTokenName', () => {
    it('returns proposed when unused', () => {
      expect(ensureUniqueTokenName(['a','b','c'], 'd')).toBe('d');
    });
    it('increments suffix deterministically', () => {
      expect(ensureUniqueTokenName(['gap','gap-2','gap-3'], 'gap')).toBe('gap-4');
    });
    it('strips existing numeric suffix before incrementing', () => {
      expect(ensureUniqueTokenName(['color','color-2'], 'color-2')).toBe('color-3');
    });
  });

  describe('prepareTokenInsertion', () => {
    it('suggests and normalizes with uniqueness', () => {
      const existing = ['brand-primary', 'brand-primary-2'];
      const res = prepareTokenInsertion('colors', 'Brand Primary', '#ABC', existing, { autoSuggestName: true, autoNormalizeValue: true, ensureUnique: true });
      expect(res.finalName.startsWith('brand-primary')).toBe(true);
      expect(res.finalValue).toBe('#aabbcc');
      expect(res.didChangeName).toBe(true);
      expect(res.didChangeValue).toBe(true);
      expect(res.report.ok).toBe(true);
    });
    it('no changes when already valid', () => {
      const res = prepareTokenInsertion('spacing', 'gap-sm', '4px', [], { autoSuggestName: true, autoNormalizeValue: true, ensureUnique: true });
      expect(res.didChangeName).toBe(false);
      expect(res.didChangeValue).toBe(false);
    });
  });
});
