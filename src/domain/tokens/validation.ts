export type TokenCategory = 'colors' | 'spacing' | 'radii' | 'shadows';

export const TOKEN_NAME_REGEX = /^[a-z][a-z0-9-]*$/; // CSS custom property friendly

export type ValidationErrorCode =
  | 'invalid_name'
  | 'invalid_value'
  | 'duplicate_name'
  | 'not_found'
  | 'batch_conflict'
  | 'style_warning';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationError { code: ValidationErrorCode; field?: 'name' | 'value' | 'general'; message: string; severity?: ValidationSeverity; }

// Simple value validators; can be extended per category later
const valueValidators: Record<string, { re: RegExp; help: string }> = {
  color: { re: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$|^rgba?\(/, help: 'Expect hex (#rgb, #rgba, #rrggbb, #rrggbbaa) or rgb()/rgba().' },
  spacing: { re: /^(\d*\.?\d+)(px|rem|em|%)$/, help: 'Expect number with unit: px | rem | em | %.' },
  radius: { re: /^(\d*\.?\d+)(px|rem|%)$/, help: 'Expect number with unit: px | rem | %.' },
  shadow: { re: /^.+$/, help: 'Any non-empty CSS shadow value.' },
};

export function validateTokenName(name: string): ValidationError | null {
  if (!TOKEN_NAME_REGEX.test(name)) {
  return { code: 'invalid_name', field: 'name', message: 'Name must start with a lowercase letter and contain only lowercase letters, digits, or hyphens.', severity: 'error' };
  }
  return null;
}

// Map plural category names used in project state to singular validator keys (internal reuse)
const CATEGORY_KEY_MAP: Record<TokenCategory, string> = {
  colors: 'color',
  spacing: 'spacing',
  radii: 'radius',
  shadows: 'shadow',
};

export function validateTokenValue(category: TokenCategory, value: string): ValidationError | null {
  const validator = valueValidators[CATEGORY_KEY_MAP[category]];
  if (validator && !validator.re.test(value)) {
  return { code: 'invalid_value', field: 'value', message: `Invalid ${category} token value. ${validator.help}`, severity: 'error' };
  }
  return null;
}

export interface ValidationResult { ok: boolean; errors?: ValidationError[]; }

export function combineErrors(errors: (ValidationError | null | undefined)[]): ValidationResult {
  const filtered = errors.filter((e): e is ValidationError => !!e);
  if (filtered.length) return { ok: false, errors: filtered };
  return { ok: true };
}

export function validateBatch(category: TokenCategory, entries: Record<string,string>): ValidationResult {
  const errors: ValidationError[] = [];
  // Detect intra-batch duplicates
  const names = Object.keys(entries);
  const seen = new Set<string>();
  for (const n of names) {
    if (seen.has(n)) {
  errors.push({ code: 'batch_conflict', field: 'name', message: `Duplicate name in batch: ${n}`, severity: 'error' });
    }
    seen.add(n);
  const nameErr = validateTokenName(n); if (nameErr) errors.push(nameErr);
  const valueErr = validateTokenValue(category, entries[n]); if (valueErr) errors.push(valueErr);
  }
  if (errors.length) return { ok: false, errors };
  return { ok: true };
}

// Rich per-token validation report for UI consumption
export interface TokenValidationReport {
  ok: boolean;
  errors: ValidationError[];
  byField: { name?: ValidationError[]; value?: ValidationError[]; general?: ValidationError[] };
  normalized?: { value?: string; changed?: boolean };
}

/**
 * Validates a single token name/value pair returning a structured report including
 * a breakdown by field for simplified UI surfacing.
 */
export interface ValidateTokenOptions { includeHeuristics?: boolean; includeNormalization?: boolean }

function heuristicNameWarnings(name: string): ValidationError[] {
  const warns: ValidationError[] = [];
  if (name.length > 30) warns.push({ code: 'style_warning', field: 'name', message: 'Name is long; consider a shorter semantic alias.', severity: 'warning' });
  if (/--+/.test(name)) warns.push({ code: 'style_warning', field: 'name', message: 'Consecutive hyphens; prefer single separators.', severity: 'warning' });
  if (/-$/.test(name)) warns.push({ code: 'style_warning', field: 'name', message: 'Trailing hyphen; remove for consistency.', severity: 'warning' });
  return warns;
}

export function validateTokenFull(category: TokenCategory, name: string, value: string, opts?: ValidateTokenOptions): TokenValidationReport {
  const errors: ValidationError[] = [];
  const nameErr = validateTokenName(name); if (nameErr) errors.push(nameErr);
  const valueErr = validateTokenValue(category, value); if (valueErr) errors.push(valueErr);
  if (opts?.includeHeuristics) {
    heuristicNameWarnings(name).forEach(w => errors.push(w));
  }
  const byField: TokenValidationReport['byField'] = {};
  for (const e of errors) {
    const field = e.field ?? 'general';
    (byField[field] ||= []).push(e);
  }
  let normalized: TokenValidationReport['normalized'];
  if (opts?.includeNormalization) {
    const norm = normalizeTokenValue(category, value);
    if (norm !== value) normalized = { value: norm, changed: true }; else normalized = { value: value, changed: false };
  }
  return { ok: errors.filter(e => e.severity !== 'warning').length === 0, errors, byField, normalized };
}

/**
 * Suggests a normalized token name that satisfies TOKEN_NAME_REGEX.
 * Strategy: lowercase, replace non-alphanumerics with hyphen, collapse hyphens,
 * trim, strip leading non-letters, prefix with 't' if first char still not a letter.
 */
export function suggestTokenName(input: string): string {
  let s = input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  // Remove leading characters until we hit a letter
  while (s && !/^[a-z]/.test(s)) s = s.slice(1);
  if (!s) s = 't';
  if (!/^[a-z]/.test(s)) s = `t-${s}`;
  // Final fallback to ensure regex compliance
  if (!TOKEN_NAME_REGEX.test(s)) {
    s = 't-' + s.replace(/[^a-z0-9-]/g, '');
    s = s.replace(/-+/g,'-');
  }
  return s;
}

// Utility: classify aggregate error set into severities for UI summaries
export function summarizeValidation(result: ValidationResult | TokenValidationReport): { errors: number; warnings: number } {
  const errs: ValidationError[] | undefined = (result as TokenValidationReport).errors || (result as ValidationResult).errors;
  if (!errs) return { errors: 0, warnings: 0 };
  let errorsCount = 0, warningsCount = 0;
  for (const e of errs) {
    if (e.severity === 'warning') warningsCount++; else errorsCount++;
  }
  return { errors: errorsCount, warnings: warningsCount };
}

// --- Normalization helpers ---
function expandShortHex(hex: string): string {
  // #abc -> #aabbcc, #abcd -> #aabbccdd
  if (/^#([0-9a-f]{3})$/.test(hex)) {
    return '#' + hex.slice(1).split('').map(c => c + c).join('');
  }
  if (/^#([0-9a-f]{4})$/.test(hex)) {
    return '#' + hex.slice(1).split('').map(c => c + c).join('');
  }
  return hex;
}

function normalizeNumericWithUnit(v: string): string {
  const m = v.match(/^(\d*\.??\d+)(px|rem|em|%)/);
  if (!m) return v;
  const num = parseFloat(m[1]);
  let out = num.toString();
  if (/\.0+$/.test(out)) out = out.replace(/\.0+$/, '');
  return out + m[2];
}

export function normalizeTokenValue(category: TokenCategory, value: string): string {
  let v = value.trim();
  if (category === 'colors') {
    // normalize hex forms only; leave rgba()/rgb() as-is except lowercase function
    if (v.startsWith('#')) {
      v = v.toLowerCase();
      v = expandShortHex(v);
    } else if (/^rgba?\(/i.test(v)) {
      v = v.replace(/^RGBA?/i, m => m.toLowerCase());
      // optionally collapse spaces
      v = v.replace(/\s+/g,' ');
    }
  } else if (category === 'spacing' || category === 'radii') {
    v = normalizeNumericWithUnit(v);
  }
  return v;
}

// Produce a unique token name given existing token names. Deterministic strategy:
// 1. Normalize proposed (already expected normalized) root by stripping any `-<number>` suffix.
// 2. If unused, return root. Else append incremental -2, -3, ... until free.
export function ensureUniqueTokenName(existing: Iterable<string>, proposed: string): string {
  const set = new Set(existing);
  const root = proposed.replace(/-\d+$/, '');
  if (!set.has(proposed) && !set.has(root)) {
    return proposed;
  }
  let i = 2;
  let candidate = `${root}-${i}`;
  while (set.has(candidate)) {
    i++;
    candidate = `${root}-${i}`;
  }
  return candidate;
}

// High-level preparation pipeline for UI token insertion flows.
export interface PrepareTokenOptions {
  autoSuggestName?: boolean; // if true and name invalid, produce suggestion
  autoNormalizeValue?: boolean; // if true, include normalized value suggestion
  ensureUnique?: boolean; // if true, ensure uniqueness against provided existingNames
  includeHeuristics?: boolean; // pass through to validation
}

export interface PreparedTokenResult {
  input: { name: string; value: string };
  finalName: string;
  finalValue: string;
  didChangeName: boolean;
  didChangeValue: boolean;
  report: TokenValidationReport; // validation on finalName/finalValue
  suggestedOriginalName?: string; // if we auto-suggested from invalid original
  normalizedOriginalValue?: string; // normalization of original value if changed
}

export function prepareTokenInsertion(
  category: TokenCategory,
  name: string,
  value: string,
  existingNames: Iterable<string>,
  opts: PrepareTokenOptions = {}
): PreparedTokenResult {
  const originalName = name;
  const originalValue = value;
  let workingName = name;
  let workingValue = value;
  let suggestedOriginalName: string | undefined;
  let normalizedOriginalValue: string | undefined;

  // Auto-suggest name if requested and invalid
  if (opts.autoSuggestName && validateTokenName(workingName)) {
    const suggestion = suggestTokenName(workingName);
    if (suggestion !== workingName) {
      suggestedOriginalName = suggestion;
      workingName = suggestion;
    }
  }

  // Ensure uniqueness if requested
  if (opts.ensureUnique) {
    const unique = ensureUniqueTokenName(existingNames, workingName);
    workingName = unique;
  }

  // Normalize value if requested
  if (opts.autoNormalizeValue) {
    const norm = normalizeTokenValue(category, workingValue);
    if (norm !== workingValue) {
      normalizedOriginalValue = norm;
      workingValue = norm;
    }
  }

  const report = validateTokenFull(category, workingName, workingValue, {
    includeHeuristics: opts.includeHeuristics,
    includeNormalization: opts.autoNormalizeValue,
  });

  return {
    input: { name: originalName, value: originalValue },
    finalName: workingName,
    finalValue: workingValue,
    didChangeName: workingName !== originalName,
    didChangeValue: workingValue !== originalValue,
    report,
    suggestedOriginalName,
    normalizedOriginalValue,
  };
}
