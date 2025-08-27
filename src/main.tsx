import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import './ui/global.css';

createRoot(document.getElementById('root')!).render(<App />);
