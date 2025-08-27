import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { validateTokenName, validateTokenValue, type TokenCategory, type ValidationError } from '../domain/tokens/validation';
import { generateTypeScale, defaultHeadingsMap, validateHeadingsMap, type TypeScaleConfig, type HeadingsMap } from '../domain/typography/scale';

// --- Token Schemas (WP-01) ---
// Legacy regex & validators kept for backward compatibility placeholder (could remove after migration)
export const tokenValueValidators = { /* deprecated: use validateTokenValue */ } as const;

export type TokenCategories = 'colors' | 'spacing' | 'radii' | 'shadows';

export interface TokensState {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  radii: Record<string, string>;
  shadows: Record<string, string>;
}

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends ProjectMeta {
  tokens: TokensState;
  prefix?: string; // namespace prefix for utilities (GH-027 groundwork)
  typography: {
    scaleConfig: TypeScaleConfig;
    headingsMap: HeadingsMap;
  };
}

// zod schemas for validation
function validateToken(category: TokenCategories, name: string, value: string): ValidationError[] {
  const errs: ValidationError[] = [];
  const nameErr = validateTokenName(name); if (nameErr) errs.push(nameErr);
  const valErr = validateTokenValue(category as TokenCategory, value, name); if (valErr) errs.push(valErr);
  return errs;
}

export interface StoreState {
  currentProject: Project | null;
  createProject: (name: string) => void;
  addToken: (category: TokenCategories, name: string, value: string) => { ok: boolean; errors?: ValidationError[] };
  updateToken: (category: TokenCategories, name: string, value: string) => { ok: boolean; errors?: ValidationError[] };
  renameToken: (category: TokenCategories, oldName: string, newName: string) => { ok: boolean; errors?: ValidationError[] };
  batchAddTokens: (category: TokenCategories, entries: Record<string,string>) => { ok: boolean; errors?: ValidationError[] };
  setPrefix: (prefix: string | undefined) => void;
  updateTypeScale: (partial: Partial<TypeScaleConfig>) => void;
  setHeadingsMap: (map: HeadingsMap) => { ok: boolean; errors?: { level: string; message: string }[] };
  deleteToken: (category: TokenCategories, name: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentProject: null,
  createProject: (name: string) =>
    set(() => ({
      currentProject: {
        id: nanoid(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tokens: { colors: {}, spacing: {}, radii: {}, shadows: {} },
        typography: {
          scaleConfig: { base: 16, ratio: 1.25 },
          headingsMap: defaultHeadingsMap(generateTypeScale({ base: 16, ratio: 1.25 }))
        },
      },
    })),
  addToken: (category, name, value) => {
    let result = { ok: true as const } as { ok: boolean; errors?: ValidationError[] };
    set((state) => {
      if (!state.currentProject) return state;
      const errors = validateToken(category, name, value);
      if (state.currentProject.tokens[category as keyof TokensState][name]) {
        errors.push({ code: 'duplicate_name', field: 'name', message: 'Duplicate name', details: { name, value, expected: 'Unique token name per category' } });
      }
      if (errors.length) {
        result = { ok: false, errors };
        return state;
      }
      const project = { ...state.currentProject };
      project.tokens = { ...project.tokens, [category]: { ...project.tokens[category as keyof TokensState], [name]: value } } as TokensState;
      project.updatedAt = new Date().toISOString();
      return { ...state, currentProject: project };
    });
    return result;
  },
  updateToken: (category, name, value) => {
    let result = { ok: true as const } as { ok: boolean; errors?: ValidationError[] };
    set((state) => {
      if (!state.currentProject) return state;
      const errors = validateToken(category, name, value);
      if (!state.currentProject.tokens[category as keyof TokensState][name]) {
        errors.push({ code: 'not_found', field: 'general', message: 'Token not found', details: { name } });
      }
      if (errors.length) {
        result = { ok: false, errors };
        return state;
      }
      const project = { ...state.currentProject };
      project.tokens = { ...project.tokens, [category]: { ...project.tokens[category as keyof TokensState], [name]: value } } as TokensState;
      project.updatedAt = new Date().toISOString();
      return { ...state, currentProject: project };
    });
    return result;
  },
  renameToken: (category, oldName, newName) => {
    let result = { ok: true as const } as { ok: boolean; errors?: ValidationError[] };
    set((state) => {
      if (!state.currentProject) return state;
      const tokens = state.currentProject.tokens[category as keyof TokensState];
      const errors: ValidationError[] = [];
  if (!tokens[oldName]) errors.push({ code: 'not_found', field: 'general', message: 'Original token not found', details: { name: oldName } });
      const nameErr = validateTokenName(newName); if (nameErr) errors.push(nameErr);
  if (tokens[newName] && oldName !== newName) errors.push({ code: 'duplicate_name', field: 'name', message: 'Name already exists', details: { name: newName, expected: 'Unique token name per category' } });
      if (errors.length) { result = { ok: false, errors }; return state; }
      const project = { ...state.currentProject };
      const newCat = { ...tokens } as Record<string,string>;
      const value = newCat[oldName];
      delete newCat[oldName];
      newCat[newName] = value;
      project.tokens = { ...project.tokens, [category]: newCat } as TokensState;
      project.updatedAt = new Date().toISOString();
      return { ...state, currentProject: project };
    });
    return result;
  },
  batchAddTokens: (category, entries) => {
    let result = { ok: true as const } as { ok: boolean; errors?: ValidationError[] };
    set((state) => {
      if (!state.currentProject) return state;
      const errors: ValidationError[] = [];
      for (const [n, v] of Object.entries(entries)) {
        validateToken(category, n, v).forEach(e => errors.push(e));
        if (state.currentProject.tokens[category as keyof TokensState][n]) {
          errors.push({ code: 'duplicate_name', field: 'name', message: `Duplicate existing: ${n}` , details: { name: n, expected: 'Unique token name per category' }});
        }
      }
      if (errors.length) { result = { ok: false, errors }; return state; }
      const project = { ...state.currentProject };
      const newCat = { ...project.tokens[category as keyof TokensState] } as Record<string,string>;
      for (const [n,v] of Object.entries(entries)) newCat[n] = v;
      project.tokens = { ...project.tokens, [category]: newCat } as TokensState;
      project.updatedAt = new Date().toISOString();
      return { ...state, currentProject: project };
    });
    return result;
  },
  setPrefix: (prefix) => set((state) => {
    if (!state.currentProject) return state;
    return { ...state, currentProject: { ...state.currentProject, prefix, updatedAt: new Date().toISOString() } };
  }),
  updateTypeScale: (partial) => set((state) => {
    if (!state.currentProject) return state;
    const prev = state.currentProject.typography.scaleConfig;
    const next: TypeScaleConfig = { ...prev, ...partial };
    if (next.presets && next.presets.length === 0) delete next.presets;
    const headingsMap = defaultHeadingsMap(generateTypeScale(next));
    const project = { ...state.currentProject, typography: { scaleConfig: next, headingsMap }, updatedAt: new Date().toISOString() };
    return { ...state, currentProject: project };
  }),
  setHeadingsMap: (map) => {
    let result = { ok: true as const } as { ok: boolean; errors?: { level: string; message: string }[] };
    set((state) => {
      if (!state.currentProject) return state;
      const steps = generateTypeScale(state.currentProject.typography.scaleConfig);
      const available = steps.map(s => s.name);
      const validation = validateHeadingsMap(map, available);
      if (!validation.ok) { result = { ok: false, errors: validation.errors }; return state; }
      const project = { ...state.currentProject, typography: { ...state.currentProject.typography, headingsMap: map }, updatedAt: new Date().toISOString() };
      return { ...state, currentProject: project };
    });
    return result;
  },
  deleteToken: (category, name) =>
    set((state) => {
      if (!state.currentProject) return state;
      const tokens = { ...state.currentProject.tokens[category as keyof TokensState] } as Record<string, string>;
      delete tokens[name];
      const project = { ...state.currentProject };
      project.tokens = { ...project.tokens, [category]: tokens } as TokensState;
      project.updatedAt = new Date().toISOString();
      return { ...state, currentProject: project };
    }),
}));

export function listTokens(category: TokenCategories, state: StoreState): [string, string][] {
  const project = state.currentProject;
  if (!project) return [];
  const entries = Object.entries(project.tokens[category]);
  // deterministic order
  return entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}
