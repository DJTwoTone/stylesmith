import React, { useState, useMemo } from 'react';
import { useStore } from '../../state/store';
import { generateTypeScale, defaultHeadingsMap } from '../../domain/typography/scale';

// Accessible field + description wrapper
const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string; id: string }>=({label, children, hint, id})=>{
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <label htmlFor={id} style={{ fontWeight: 500 }}>{label}</label>
      {children}
      {hint && <div id={id+'-hint'} style={{ fontSize: 12, color: '#555' }}>{hint}</div>}
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
    <section style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginTop: 32 }} aria-labelledby="typography-heading">
      <h2 id="typography-heading" style={{ marginTop: 0 }}>Typography</h2>
      <p style={{ fontSize: 13, color: '#555' }}>Configure modular type scale and map heading levels to scale tokens. Changes regenerate deterministically.</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Field id="type-base" label="Base (px)" hint="Root step size; positive number.">
          <input id="type-base" type="number" min={1} value={base} placeholder={String(scaleConfig.base)} onChange={e=>setBase(e.target.value)} style={{ padding: 4 }} />
        </Field>
        <Field id="type-ratio" label="Ratio" hint="Multiplicative step (e.g. 1.25).">
          <input id="type-ratio" type="number" step="0.01" min={1.01} value={ratio} placeholder={String(scaleConfig.ratio)} onChange={e=>setRatio(e.target.value)} style={{ padding: 4 }} />
        </Field>
        <Field id="type-presets" label="Presets (px list)" hint="Comma-separated explicit sizes overrides scale.">
          <input id="type-presets" value={presets} placeholder={scaleConfig.presets ? scaleConfig.presets.join(',') : ''} onChange={e=>setPresets(e.target.value)} style={{ padding: 4, minWidth: 240 }} />
        </Field>
        <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 8 }}>
          <button type="button" onClick={applyScale}>Apply Scale</button>
          <button type="button" onClick={()=>{ setBase(''); setRatio(''); setPresets(''); }}>Reset Fields</button>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3 style={{ margin: '12px 0 4px' }}>Scale Preview</h3>
        <table style={{ borderCollapse:'collapse', fontSize: 13 }} aria-label="Type scale preview">
          <thead>
            <tr><th style={{textAlign:'left', padding:4}}>Token</th><th style={{textAlign:'left', padding:4}}>px</th><th style={{textAlign:'left', padding:4}}>rem</th></tr>
          </thead>
          <tbody>
            {steps.map(s=> (
              <tr key={s.name}>
                <td style={{ padding:4 }}>--{s.name}</td>
                <td style={{ padding:4 }}>{s.px}</td>
                <td style={{ padding:4 }}>{s.rem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ margin: '12px 0 4px' }}>Headings Mapping</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {(Object.keys(localHeadings) as (keyof typeof localHeadings)[]).map(level => (
            <div key={level} style={{ display:'flex', flexDirection:'column' }}>
              <label htmlFor={`heading-${level}`} style={{ fontSize:12, fontWeight:600 }}>{level.toUpperCase()}</label>
              <select id={`heading-${level}`} value={localHeadings[level]} onChange={e=> setLocalHeadings({...localHeadings, [level]: e.target.value})} style={{ padding:4 }}>
                {availableTokenNames.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="button" onClick={saveHeadings}>Save Headings Map</button>
          <button type="button" onClick={resetHeadingsToDefault}>Default Mapping</button>
        </div>
        <div aria-live="polite" style={{ marginTop: 8 }}>
          {headingErrors.length > 0 && (
            <ul style={{ color: 'crimson', margin:0, paddingLeft: 18 }}>
              {headingErrors.map(e => <li key={e}>{e}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
