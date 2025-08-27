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
        <img src={blueprintMode ? '/logos/StyleSmithLogo-offwhite.png' : '/logos/StyleSmithLogo-blue.png'} alt="StyleSmith logo" />
        <h1 className="app-shell-title">StyleSmith</h1>
        <div className="app-shell-spacer" />
        <button className="app-shell-btn" onClick={() => setBlueprintMode(m => !m)} aria-pressed={blueprintMode}>{blueprintMode ? 'Light Sheet' : 'Blueprint Mode'}</button>
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
