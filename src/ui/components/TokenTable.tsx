import React, { useState, useMemo } from 'react';
import styles from './TokenTable.module.css';
import { useStore } from '../../state/store';
import { validateTokenFull, suggestTokenName, normalizeTokenValue, validateBatch } from '../../domain/tokens/validation';
import { parseTokenBatch } from '../../domain/tokens/parse';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface Props { category: 'colors' | 'spacing' | 'radii' | 'shadows'; }

export const TokenTable: React.FC<Props> = ({ category }) => {
  const { currentProject, addToken, updateToken, deleteToken, renameToken, batchAddTokens } = useStore();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]); // legacy list display
  const [touched, setTouched] = useState<{ name?: boolean; value?: boolean }>({});
  const [showBatch, setShowBatch] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [batchPreview, setBatchPreview] = useState<ReturnType<typeof parseTokenBatch> | null>(null);
  const [batchErrors, setBatchErrors] = useState<string[]>([]);

  // Derived validation report (field-level) – step 1 (GH-001/021 UI integration)
  const debouncedName = useDebouncedValue(name, 180);
  const debouncedValue = useDebouncedValue(value, 180);

  const validation = useMemo(() => {
    if (!debouncedName && !debouncedValue) return null;
    if (!currentProject) return null;
    const report = validateTokenFull(category, debouncedName, debouncedValue, { includeHeuristics: true, includeNormalization: true });
    // Inject duplicate detection (excluding editing original name)
    if (debouncedName && currentProject.tokens[category][debouncedName] && originalName !== debouncedName) {
      report.errors.push({
        code: 'duplicate_name',
        field: 'name',
        message: `Duplicate name already exists: "${debouncedName}"`,
        severity: 'error',
        details: { name: debouncedName, expected: 'Unique token name per category' }
      });
      (report.byField.name ||= []).push(report.errors[report.errors.length - 1]);
      report.ok = false;
    }
    return report;
  }, [category, debouncedName, debouncedValue, currentProject, originalName]);

  const nameErrors = validation?.byField.name?.filter(e => e.severity !== 'warning');
  const valueErrors = validation?.byField.value?.filter(e => e.severity !== 'warning');
  const nameWarnings = validation?.byField.name?.filter(e => e.severity === 'warning');
  const valueWarnings = validation?.byField.value?.filter(e => e.severity === 'warning');

  // Suggestions (auto-suggest + normalization) – step 3
  const nameSuggestion = useMemo(() => {
    if (!name) return null;
    if (nameErrors?.some(e => e.code === 'invalid_name')) {
      const s = suggestTokenName(name);
      if (s && s !== name) return s;
    }
    return null;
  }, [name, nameErrors]);

  const valueNormalization = useMemo(() => {
    if (!value) return null;
    const norm = normalizeTokenValue(category, value);
    return norm !== value ? norm : null;
  }, [value, category]);

  if (!currentProject) return <p>No project. Create one.</p>;

  const tokens = Object.entries(currentProject.tokens[category]).sort(([a],[b]) => a.localeCompare(b));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{category}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Value</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(([n, v]) => (
            <tr key={n}>
              <td className={styles.td}>--{n}</td>
              <td className={styles.td}>{v}</td>
              <td className={styles.td}>
                <button onClick={() => { setName(n); setOriginalName(n); setValue(v); }}>Edit</button>{' '}
                <button onClick={() => deleteToken(category, n)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let result;
          if (originalName && originalName !== name) {
            // Rename then update value if value changed
            result = renameToken(category, originalName, name);
            if (!result.ok) { setSubmitErrors((result.errors || []).map(e => e.message)); return; }
            result = updateToken(category, name, value);
          } else {
            const exists = !!currentProject.tokens[category][name];
            result = exists ? updateToken(category, name, value) : addToken(category, name, value);
          }
          if (!result.ok) { setSubmitErrors((result.errors || []).map(e => e.message)); return; }
          setSubmitErrors([]); setName(''); setValue(''); setOriginalName(null); setTouched({});
        }}
        className={styles.form}
      >
        <div className={styles.column}>
          <input
            placeholder="name"
            value={name}
            aria-label={`${category} token name`}
            aria-invalid={!!debouncedName && !!nameErrors?.length}
            aria-describedby={nameErrors?.length ? 'token-name-errors' : undefined}
            onBlur={() => setTouched(t => ({ ...t, name: true }))}
            onChange={(e) => { setName(e.target.value); }}
            className={`${styles.input} ${nameErrors?.length ? styles.inputError : ''}`}
          />
          {touched.name && (nameErrors?.length || nameWarnings?.length) && (
            <ul id="token-name-errors" className={nameErrors?.length ? styles.errorList : styles.warningList}>
              {nameErrors?.map(e => <li key={e.message}>{e.message}{e.details?.expected && <span className={styles.expectedHint}> — Expected: {e.details.expected}</span>}</li>)}
              {!nameErrors?.length && nameWarnings?.map(e => <li key={e.message}>{e.message}</li>)}
            </ul>
          )}
          {nameSuggestion && (
            <div className={styles.suggestion}>
              <button type="button" onClick={() => { setName(nameSuggestion); setTouched(t=>({...t, name:true})); }} className={styles.suggestionButton} aria-label={`Apply suggested name ${nameSuggestion}`}>Apply suggestion: {nameSuggestion}</button>
            </div>
          )}
        </div>
        <div className={styles.columnValue}>
          <input
            placeholder="value"
            value={value}
            aria-label={`${category} token value`}
            aria-invalid={!!debouncedValue && !!valueErrors?.length}
            aria-describedby={valueErrors?.length ? 'token-value-errors' : undefined}
            onBlur={() => setTouched(t => ({ ...t, value: true }))}
            onChange={(e) => { setValue(e.target.value); }}
            className={`${styles.input} ${valueErrors?.length ? styles.inputError : ''}`}
          />
          {touched.value && (valueErrors?.length || valueWarnings?.length) && (
            <ul id="token-value-errors" className={valueErrors?.length ? styles.errorList : styles.warningList}>
              {valueErrors?.map(e => <li key={e.message}>{e.message}{e.details?.expected && <span className={styles.expectedHint}> — Expected: {e.details.expected}</span>}</li>)}
              {!valueErrors?.length && valueWarnings?.map(e => <li key={e.message}>{e.message}</li>)}
            </ul>
          )}
          {valueNormalization && !valueErrors?.length && (
            <div className={styles.normalize}>
              <button type="button" onClick={() => { setValue(valueNormalization); setTouched(t=>({...t, value:true})); }} className={styles.normalizeButton} aria-label={`Normalize value to ${valueNormalization}`}>Normalize: {valueNormalization}</button>
            </div>
          )}
        </div>
        <button type="submit">{originalName ? (originalName !== name ? 'Rename & Save' : 'Save') : (currentProject.tokens[category][name] ? 'Update' : 'Add')}</button>
        {originalName && (
          <button type="button" onClick={() => { setOriginalName(null); setName(''); setValue(''); setSubmitErrors([]); setTouched({}); }}>Cancel</button>
        )}
      </form>
      <div aria-live="polite" className={styles.submitRegion}>
        {submitErrors.length > 0 && (
          <ul className={styles.submitErrors}>
            {submitErrors.map((er) => <li key={er}>{er}</li>)}
          </ul>
        )}
      </div>
      {/* Batch Add Toggle */}
      <div className={styles.batchToggle}>
        <button type="button" onClick={()=> setShowBatch(s=>!s)} aria-expanded={showBatch} aria-controls={`batch-${category}`}>{showBatch ? 'Hide Batch Add' : 'Batch Add Tokens'}</button>
      </div>
      {showBatch && (
        <div id={`batch-${category}`} className={styles.batchPanel}>
          <p className={styles.batchHint}>Paste lines like: <code>--token-name: value;</code> or <code>token-name: value;</code> (comments starting with // or /* ignored).</p>
          <textarea
            value={batchText}
            onChange={(e)=>{ setBatchText(e.target.value); const parsed = parseTokenBatch(category, e.target.value); setBatchPreview(parsed); setBatchErrors([]); }}
            rows={6}
            className={styles.textarea}
            placeholder={`--${category}-example: ...;`}
          />
          {batchPreview && (
            <div className={styles.batchPreview}>
              <strong className={styles.batchPreviewLabel}>Preview:</strong>
              <table className={styles.batchPreviewTable}>
                <thead className={styles.batchPreviewHead}><tr><th className={styles.batchPreviewHeadCell}>Line</th><th className={styles.batchPreviewHeadCell}>Name</th><th className={styles.batchPreviewHeadCell}>Value</th><th className={styles.batchPreviewHeadCell}>Status</th></tr></thead>
                <tbody>
                  {batchPreview.lines.map(l => (
                    <tr key={l.line} className={l.errors?.length ? styles.batchPreviewRowError : undefined}>
                      <td className={styles.batchPreviewCell}>{l.line}</td>
                      <td className={styles.batchPreviewCell}>{l.name || ''}</td>
                      <td className={styles.batchPreviewCell}>{l.value || ''}</td>
                      <td className={styles.batchPreviewCell}>
                        {l.errors?.length ? l.errors.map(e=> e.code).join(',') : (l.name ? 'ok' : '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.batchSummary}>
                {Object.keys(batchPreview.entries).length} valid tokens parsed. {batchPreview.errors.length} lines with errors.
              </div>
            </div>
          )}
          <div className={styles.batchActions}>
            <button type="button" disabled={!batchPreview || Object.keys(batchPreview.entries).length === 0} onClick={() => {
              if (!batchPreview) return;
              // Validate against existing tokens for duplicates
              const existing = currentProject.tokens[category];
              const dupes: string[] = [];
              for (const k of Object.keys(batchPreview.entries)) if (existing[k]) dupes.push(k);
              if (dupes.length) { setBatchErrors([`Duplicate existing tokens: ${dupes.join(', ')}`]); return; }
              const batchValidation = validateBatch(category, batchPreview.entries);
              if (!batchValidation.ok) { setBatchErrors(batchValidation.errors!.map(e=>e.message)); return; }
              const res = batchAddTokens(category, batchPreview.entries);
              if (!res.ok) { setBatchErrors(res.errors!.map(e=> e.message)); return; }
              // success
              setBatchErrors([]); setBatchText(''); setBatchPreview(null); setShowBatch(false);
            }}>Apply {Object.keys(batchPreview?.entries || {}).length} Tokens</button>
            <button type="button" onClick={()=> { setBatchText(''); setBatchPreview(null); setBatchErrors([]); }}>Clear</button>
          </div>
          {batchErrors.length > 0 && (
            <ul className={styles.batchErrors}>
              {batchErrors.map(e => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
