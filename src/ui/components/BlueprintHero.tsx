import React, { useState } from 'react';
import cls from './BlueprintHero.module.css';

export const BlueprintHero: React.FC = () => {
  const [dark, setDark] = useState(false);
  return (
    <section className={dark ? `${cls.hero} ${cls.dark}` : cls.hero} aria-label="Blueprint hero">
      <div className={cls.bg} />
      <div className={cls.lines} />
      <div className={cls.border} />
      <div className={cls.inner}>
        <h1 className={cls.title}>StyleSmith</h1>
        <p className={cls.note}>Token-driven CSS, documented like a drawing set.</p>
        <div className={cls.controls}>
          <button className={`${cls.btn} ${cls.btnPrimary}`} onClick={() => setDark(d => !d)}>
            {dark ? 'Light Sheet' : 'Blueprint Mode'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlueprintHero;