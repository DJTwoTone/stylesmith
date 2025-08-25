import { create } from 'zustand';
import { nanoid } from 'nanoid';

// --- Token Schemas (WP-01) ---
const tokenNameRegex = /^[a-z][a-z0-9-]*$/; // CSS custom property compatible (without -- prefix)

export const tokenValueValidators = {
  color: /^#([0-9a-fA-F]{3,8}|[0-9a-fA-F]{6})$|^rgba?\(/,
  spacing: /^(\d*\.?\d+)(px|rem|em|%)$/, // basic units
  radius: /^(\d*\.?\d+)(px|rem|%)$/,
  shadow: /^.+$/, // TODO refine
};

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
}

// zod schemas for validation
function validateToken(category: TokenCategories, name: string, value: string): string[] {
  const errors: string[] = [];
  if (!tokenNameRegex.test(name)) errors.push('Name invalid');
  const key = category === 'radii' ? 'radius' : category;
  const validator = tokenValueValidators[key as keyof typeof tokenValueValidators];
  if (validator && !validator.test(value)) errors.push('Value invalid');
  return errors;
}

export interface StoreState {
  currentProject: Project | null;
  createProject: (name: string) => void;
  addToken: (category: TokenCategories, name: string, value: string) => { ok: boolean; errors?: string[] };
  updateToken: (category: TokenCategories, name: string, value: string) => { ok: boolean; errors?: string[] };
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
      },
    })),
  addToken: (category, name, value) => {
    let result = { ok: true as const } as { ok: boolean; errors?: string[] };
    set((state) => {
      if (!state.currentProject) return state;
      const errors = validateToken(category, name, value);
      if (state.currentProject.tokens[category as keyof TokensState][name]) errors.push('Duplicate name');
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
    let result = { ok: true as const } as { ok: boolean; errors?: string[] };
    set((state) => {
      if (!state.currentProject) return state;
      const errors = validateToken(category, name, value);
      if (!state.currentProject.tokens[category as keyof TokensState][name]) errors.push('Not found');
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
