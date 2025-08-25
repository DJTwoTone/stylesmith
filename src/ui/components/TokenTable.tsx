import React, { useState } from 'react';
import { useStore } from '../../state/store';

interface Props { category: 'colors' | 'spacing' | 'radii' | 'shadows'; }

export const TokenTable: React.FC<Props> = ({ category }) => {
  const { currentProject, addToken, updateToken, deleteToken } = useStore();
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  if (!currentProject) return <p>No project. Create one.</p>;

  const tokens = Object.entries(currentProject.tokens[category]).sort(([a],[b]) => a.localeCompare(b));

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ textTransform: 'capitalize' }}>{category}</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 4 }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 4 }}>Value</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 4 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(([n, v]) => (
            <tr key={n}>
              <td style={{ padding: 4 }}>--{n}</td>
              <td style={{ padding: 4 }}>{v}</td>
              <td style={{ padding: 4 }}>
                <button onClick={() => { setName(n); setValue(v); }}>Edit</button>{' '}
                <button onClick={() => deleteToken(category, n)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const exists = !!currentProject.tokens[category][name];
          const result = exists ? updateToken(category, name, value) : addToken(category, name, value);
          if (!result.ok) { setErrors(result.errors || []); return; }
          setErrors([]); setName(''); setValue('');
        }}
        style={{ marginTop: 12, display: 'flex', gap: 8 }}
      >
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="value" value={value} onChange={(e) => setValue(e.target.value)} style={{ flex: 2 }} />
        <button type="submit">{currentProject.tokens[category][name] ? 'Update' : 'Add'}</button>
      </form>
      {errors.length > 0 && (
        <ul style={{ color: 'crimson', marginTop: 8 }}>
          {errors.map((er) => <li key={er}>{er}</li>)}
        </ul>
      )}
    </div>
  );
};
