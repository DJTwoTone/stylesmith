import React from 'react';
import styles from './Landing.module.css';
import { useStore } from '../../state/store';

interface ProjectSummary { id: string; name: string; createdAt: string; updatedAt: string }

// Placeholder local persistence (future: move to proper persistence layer WP-14)
function loadRecentProjects(): ProjectSummary[] {
  try {
    const raw = localStorage.getItem('ss_recentProjects');
    if (!raw) return [];
    const arr = JSON.parse(raw) as ProjectSummary[];
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, 8);
  } catch { return []; }
}
function rememberProject(p: ProjectSummary) {
  try {
    const list = loadRecentProjects().filter(x => x.id !== p.id);
    list.unshift(p);
    localStorage.setItem('ss_recentProjects', JSON.stringify(list.slice(0, 12)));
  } catch { /* ignore */ }
}

export const Landing: React.FC<{ onEnter: () => void; }> = ({ onEnter }) => {
  const { createProject, currentProject } = useStore();
  const [projName, setProjName] = React.useState('My Project');
  const recent = loadRecentProjects();

  React.useEffect(() => {
    if (currentProject) {
      rememberProject({ id: currentProject.id, name: currentProject.name, createdAt: currentProject.createdAt, updatedAt: currentProject.updatedAt });
    }
  }, [currentProject]);

  function handleCreate() {
    if (!projName.trim()) return;
    createProject(projName.trim());
    onEnter();
  }

  return (
    <main className={styles.landingRoot}>
      <div className={styles.hero}>
        <div className={styles.heroLogos}>
          <img src="/logos/StyleSmithLogo-transparent.png" alt="StyleSmith logo" className={styles.logoImg} />
        </div>
        <h1 className={styles.tagline}>Deterministic design token & utility generation in under five minutes.</h1>
        <p className={styles.subtitle}>StyleSmith lets you define a precise token set, toggle lean utility families, and export byte-stable CSS artifacts (tokens → utilities → optional components & docs) — all local-first, no account.</p>
        <div className={styles.ctaRow}>
          <button className={styles.ctaPrimary} onClick={handleCreate}>Create Project</button>
          <button onClick={() => { setProjName('Sample Project'); handleCreate(); }}>Quick Start Sample</button>
          <button onClick={() => { window.alert('Primer coming soon.'); }}>Learn Basics</button>
        </div>
      </div>

      {recent.length > 0 && (
        <section className={styles.section} aria-labelledby="recent-heading">
          <h2 id="recent-heading">Recent Projects</h2>
          <div className={styles.projectsList}>
            <ul>
              {recent.map(p => (
                <li key={p.id}>
                  <span>{p.name}</span>
                  <button onClick={() => { createProject(p.name); onEnter(); }}>Open</button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={styles.section} aria-labelledby="features-heading">
        <h2 id="features-heading">Focused Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}><h3>Determinism</h3><p>Stable ordering & hashing ensures reproducible outputs for CI.</p></div>
          <div className={styles.feature}><h3>Lean Utilities</h3><p>Only the families you toggle are generated; stay under size budgets.</p></div>
          <div className={styles.feature}><h3>Type Scale</h3><p>Modular scale builder with accessible headings mapping.</p></div>
          <div className={styles.feature}><h3>Accessibility</h3><p>Contrast & reduced-motion respect baked in from the start.</p></div>
          <div className={styles.feature}><h3>Local-First</h3><p>All data stays on device; no accounts, no network required.</p></div>
          <div className={styles.feature}><h3>Docs Export</h3><p>Printable style sheet & option component recipes on demand.</p></div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="primer-heading">
        <h2 id="primer-heading">Primer</h2>
        <p className={styles.primer}>Define tokens for color, spacing, radii, and shadows. Toggle utility families (planned). Adjust a modular type scale and map headings. Export deterministic CSS bundles ready for production & documentation. Re-open later; unchanged configs produce byte-identical outputs.</p>
      </section>

      <p className={styles.meta}>Alpha build • Local data only • Analytics & utilities selection roadmap in progress</p>
    </main>
  );
};
