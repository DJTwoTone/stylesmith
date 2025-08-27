import React from 'react';
import styles from './App.module.css';
import { useStore } from '../state/store';
import { TokenTable } from './components/TokenTable';
import { TypographyEditor } from './components/TypographyEditor';
import { Landing } from './pages/Landing';

export const App: React.FC = () => {
  const { currentProject } = useStore();
  const [entered, setEntered] = React.useState(false);
  if (!entered) return <Landing onEnter={() => setEntered(true)} />;
  return (
    <div className={styles.appRoot}>
      <h1>StyleSmith</h1>
      <p className={styles.projectMeta}>Project: {currentProject?.name}</p>
      {!currentProject && <p>No project yet.</p>}
      {currentProject && (
        <>
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
