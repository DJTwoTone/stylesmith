import React from 'react';
import { useStore } from '../state/store';
import { TokenTable } from './components/TokenTable';

export const App: React.FC = () => {
  const { currentProject, createProject } = useStore();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>StyleSmith</h1>
      {!currentProject && (
        <button onClick={() => createProject('My Project')}>Create Project</button>
      )}
      {currentProject && (
        <>
          <p style={{ color: '#555' }}>Project: {currentProject.name}</p>
          <TokenTable category="colors" />
          <TokenTable category="spacing" />
          <TokenTable category="radii" />
          <TokenTable category="shadows" />
        </>
      )}
    </div>
  );
};
