import { validateTokenName, validateTokenValue, type TokenCategory, type ValidationError } from './validation';

export interface ParsedTokenLine {
  line: number;
  raw: string;
  name?: string;
  value?: string;
  errorCodes?: string[];
  errors?: ValidationError[];
}

export interface BatchParseResult {
  entries: Record<string,string>;
  lines: ParsedTokenLine[]; // preserves order & errors
  ok: boolean;
  errors: ParsedTokenLine[]; // subset of lines with errors
}

// Supports two forms:
//  --token-name: value; (standard CSS custom property)
//  token-name: value;   (simplified without leading dashes)
// Ignores lines starting with // or /* or * or # for convenience.
// Optional leading "--" sequence; capture group excludes dashes.
const CSS_VAR_RE = /^(?:--)?([a-zA-Z0-9][a-zA-Z0-9-_]*)\s*:\s*([^;]+);?$/;

export function parseTokenBatch(category: TokenCategory, text: string): BatchParseResult {
  const lines = text.split(/\r?\n/);
  const entries: Record<string,string> = {};
  const results: ParsedTokenLine[] = [];
  const nameCounts: Record<string, number> = {};

  lines.forEach((raw, i) => {
    const idx = i + 1;
    const trimmed = raw.trim();
    if (!trimmed) { results.push({ line: idx, raw }); return; }
    if (/^(\/\/|\/\*|\*|#)/.test(trimmed)) { results.push({ line: idx, raw }); return; }
  const m = trimmed.match(CSS_VAR_RE);
    if (!m) {
      results.push({ line: idx, raw, errorCodes: ['parse'], errors: [{ code: 'invalid_value', field: 'general', message: 'Unable to parse line as token declaration', severity: 'error' }] as ValidationError[] });
      return;
    }
  const name = m[1];
    const value = m[2].trim();
    const errs: ValidationError[] = [];
    const nameErr = validateTokenName(name); if (nameErr) errs.push(nameErr);
    const valueErr = validateTokenValue(category, value, name); if (valueErr) errs.push(valueErr);
    nameCounts[name] = (nameCounts[name] || 0) + 1;
    results.push({ line: idx, raw, name, value, errorCodes: errs.map(e=>e.code), errors: errs.length ? errs : undefined });
    if (!errs.length) entries[name] = value; // only include valid lines
  });

  // Detect intra-batch duplicates (same name appearing 2+ times)
  for (const r of results) {
    if (r.name && nameCounts[r.name] > 1) {
      const dupeErr: ValidationError = { code: 'batch_conflict', field: 'name', message: `Duplicate in batch: ${r.name}`, severity: 'error', details: { name: r.name, expected: 'Each name appears only once in a batch' } };
      if (r.errors) r.errors.push(dupeErr); else r.errors = [dupeErr];
      if (r.errorCodes) r.errorCodes.push('batch_conflict'); else r.errorCodes = ['batch_conflict'];
      // Ensure not inserted multiple times; keep first occurrence's entry and ignore later duplicates
      if (nameCounts[r.name] > 1 && entries[r.name] && r.raw !== results.find(fr => fr.name === r.name)?.raw) {
        // later duplicates won't override because we only assign on first valid pass above
      }
    }
  }

  const errorLines = results.filter(r => r.errors && r.errors.length);
  return { entries, lines: results, ok: errorLines.length === 0, errors: errorLines };
}
