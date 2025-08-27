import React, { useState, useMemo } from 'react';
import styles from './TypographyEditor.module.css';
import { useStore } from '../../state/store';
import { generateTypeScale, defaultHeadingsMap } from '../../domain/typography/scale';

// Accessible field + description wrapper
const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string; id: string }>=({label, children, hint, id})=>{
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>{label}</label>
      {children}
      {hint && <div id={id+'-hint'} className={styles.fieldHint}>{hint}</div>}
    </div>
  );
};

export const TypographyEditor: React.FC = () => {
  const { currentProject, updateTypeScale, setHeadingsMap } = useStore();
  const [base, setBase] = useState('');
  const [ratio, setRatio] = useState('');
  const [presets, setPresets] = useState('');
  const [headingErrors, setHeadingErrors] = useState<string[]>([]);

  // Derive safe references (avoid conditional hooks by using guards inside logic)
  const scaleConfig = currentProject?.typography.scaleConfig;
  const currentHeadings = currentProject?.typography.headingsMap;

  const effectiveBase = scaleConfig ? (base === '' ? scaleConfig.base : Number(base)) : 16;
  const effectiveRatio = scaleConfig ? (ratio === '' ? scaleConfig.ratio : Number(ratio)) : 1.25;
  const effectivePresets = scaleConfig ? (presets.trim() === '' ? scaleConfig.presets : presets.split(',').map(s=>Number(s.trim())).filter(n=>!isNaN(n))) : undefined;

  const steps = useMemo(()=> generateTypeScale({ base: effectiveBase, ratio: effectiveRatio, presets: effectivePresets && effectivePresets.length ? effectivePresets : undefined }), [effectiveBase, effectiveRatio, effectivePresets]);
  const availableTokenNames = steps.map(s=>s.name);

  const [localHeadings, setLocalHeadings] = useState(currentHeadings || defaultHeadingsMap(steps));
  React.useEffect(()=>{ if (currentHeadings) setLocalHeadings(currentHeadings); }, [currentHeadings]);

  function applyScale() {
      if (!scaleConfig) return;
      if ((base && Number(base) > 0) || (ratio && Number(ratio) > 0) || presets) {
        updateTypeScale({
          base: Number.isFinite(effectiveBase) && effectiveBase > 0 ? effectiveBase : scaleConfig.base,
          ratio: Number.isFinite(effectiveRatio) && effectiveRatio > 0 ? effectiveRatio : scaleConfig.ratio,
          presets: effectivePresets && effectivePresets.length ? effectivePresets : undefined,
        });
        setHeadingErrors([]);
      }
  }

  function resetHeadingsToDefault() {
  const map = defaultHeadingsMap(steps);
    setLocalHeadings(map);
    const res = setHeadingsMap(map);
    if (!res.ok) setHeadingErrors((res.errors||[]).map(e=>e.message)); else setHeadingErrors([]);
  }

  function saveHeadings() {
    const res = setHeadingsMap(localHeadings);
    if (!res.ok) setHeadingErrors((res.errors||[]).map(e=>e.message)); else setHeadingErrors([]);
  }

  if (!currentProject || !scaleConfig) return null;

  return (
    <section className={styles.section} aria-labelledby="typography-heading">
      <h2 id="typography-heading" className={styles.heading}>Typography</h2>
      <p className={styles.sectionIntro}>Configure modular type scale and map heading levels to scale tokens. Changes regenerate deterministically.</p>
      <div className={styles.scaleControls}>
        <Field id="type-base" label="Base (px)" hint="Root step size; positive number.">
          <input id="type-base" type="number" min={1} value={base} placeholder={String(scaleConfig.base)} onChange={e=>setBase(e.target.value)} className={styles.input} />
        </Field>
        <Field id="type-ratio" label="Ratio" hint="Multiplicative step (e.g. 1.25).">
          <input id="type-ratio" type="number" step="0.01" min={1.01} value={ratio} placeholder={String(scaleConfig.ratio)} onChange={e=>setRatio(e.target.value)} className={styles.input} />
        </Field>
        <Field id="type-presets" label="Presets (px list)" hint="Comma-separated explicit sizes overrides scale.">
          <input id="type-presets" value={presets} placeholder={scaleConfig.presets ? scaleConfig.presets.join(',') : ''} onChange={e=>setPresets(e.target.value)} className={styles.inputWide} />
        </Field>
        <div className={styles.applyRow}>
          <button type="button" onClick={applyScale}>Apply Scale</button>
          <button type="button" onClick={()=>{ setBase(''); setRatio(''); setPresets(''); }}>Reset Fields</button>
        </div>
      </div>
      <div className={styles.scalePreview}>
        <h3 className={styles.subheading}>Scale Preview</h3>
        <table className={styles.scaleTable} aria-label="Type scale preview">
          <thead>
            <tr><th className={styles.scaleTableHeadCell}>Token</th><th className={styles.scaleTableHeadCell}>px</th><th className={styles.scaleTableHeadCell}>rem</th></tr>
          </thead>
          <tbody>
            {steps.map(s=> (
              <tr key={s.name}>
                <td className={styles.scaleTableCell}>--{s.name}</td>
                <td className={styles.scaleTableCell}>{s.px}</td>
                <td className={styles.scaleTableCell}>{s.rem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.headingsMapping}>
        <h3 className={styles.subheading}>Headings Mapping</h3>
        <div className={styles.mappingGrid}>
          {(Object.keys(localHeadings) as (keyof typeof localHeadings)[]).map(level => (
            <div key={level} className={styles.mappingItem}>
              <label htmlFor={`heading-${level}`} className={styles.mappingLabel}>{level.toUpperCase()}</label>
              <select id={`heading-${level}`} value={localHeadings[level]} onChange={e=> setLocalHeadings({...localHeadings, [level]: e.target.value})} className={styles.mappingSelect}>
                {availableTokenNames.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className={styles.mappingActions}>
          <button type="button" onClick={saveHeadings}>Save Headings Map</button>
          <button type="button" onClick={resetHeadingsToDefault}>Default Mapping</button>
        </div>
        <div aria-live="polite" className={styles.statusRegion}>
          {headingErrors.length > 0 && (
            <ul className={styles.statusErrors}>
              {headingErrors.map(e => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
