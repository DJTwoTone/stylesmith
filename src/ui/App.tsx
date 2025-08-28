import React from 'react';
import styles from './App.module.css';
import { useStore } from '../state/store';
import { TokenTable } from './components/TokenTable';
import { TypographyEditor } from './components/TypographyEditor';
import { Landing } from './pages/Landing';
import { useEffect, useState } from 'react';

export const App: React.FC = () => {
  const { currentProject } = useStore();
  const [entered, setEntered] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('bp-dark', blueprintMode);
  }, [blueprintMode]);

  if (!entered) return <Landing onEnter={() => setEntered(true)} />;

  return (
    <>
      <header className="app-shell-header" role="banner">
        <div className="app-shell-left" style={{display:'flex', alignItems:'center', gap:12}}>
          <img src={blueprintMode ? '/logos/StyleSmithLogo-offwhite.png' : '/logos/StyleSmithLogo-blue.png'} alt="StyleSmith logo" />
          <h1 className="app-shell-title" style={{margin:0}}>StyleSmith</h1>
          {currentProject && <span className="app-shell-project" style={{fontFamily:'IBM Plex Mono, ui-monospace, monospace', fontSize:12, opacity:.85}}>• {currentProject.name}</span>}
        </div>
        <div className="app-shell-actions" style={{display:'flex', gap:12}}>
          <button className="app-shell-btn" onClick={() => setEntered(false)} aria-label="Projects" title="Projects">Projects</button>
          <button className="app-shell-btn" onClick={() => setBlueprintMode(m => !m)} aria-pressed={blueprintMode}>{blueprintMode ? 'Light Sheet' : 'Blueprint Mode'}</button>
        </div>
      </header>
      <main className="app-shell-main bp-surface-grid" role="main">
        <p className={styles.projectMeta}>{currentProject ? `Project: ${currentProject.name}` : 'No project yet.'}</p>
        {currentProject && (
          <>
            <TokenTable category="colors" />
            <TokenTable category="spacing" />
            <TokenTable category="radii" />
            <TokenTable category="shadows" />
            <TypographyEditor />
          </>
        )}
      </main>
    </>
  );
};
