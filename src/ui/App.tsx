import React from 'react';
import styles from './App.module.css';
import { useStore } from '../state/store';
import { TokenTable } from './components/TokenTable';
import { TypographyEditor } from './components/TypographyEditor';

export const App: React.FC = () => {
  const { currentProject, createProject } = useStore();
  return (
  <div className={styles.appRoot}>
      <h1>StyleSmith</h1>
      {!currentProject && (
        <button onClick={() => createProject('My Project')}>Create Project</button>
      )}
      {currentProject && (
        <>
      <p className={styles.projectMeta}>Project: {currentProject.name}</p>
          <TokenTable category="colors" />
          <TokenTable category="spacing" />
          <TokenTable category="radii" />
          <TokenTable category="shadows" />
          <TypographyEditor />
        </>
      )}
    </div>
  );
};
