import { generateTypeScale } from '../typography/scale';
import type { Project } from '../../state/store';

export interface VirtualTokenEntry {
  category: 'fontSizes';
  name: string; // e.g., font-size-0
  value: string; // rem value
  px: number;
  source: 'typography-scale';
}

export function getFontSizeVirtualTokens(project: Project): VirtualTokenEntry[] {
  // Defensive: older project instances (pre-typography integration) may lack typography.
  const base = project.typography?.scaleConfig.base ?? 16;
  const ratio = project.typography?.scaleConfig.ratio ?? 1.25;
  const presets = project.typography?.scaleConfig.presets;
  const steps = generateTypeScale({ base, ratio, presets });
  return steps.map(s => ({ category: 'fontSizes' as const, name: s.name, value: s.rem, px: s.px, source: 'typography-scale' as const }));
}

export interface AllTokenEntry { category: string; name: string; value: string; virtual?: boolean; source?: string; }

export function listAllTokenEntries(project: Project): AllTokenEntry[] {
  const entries: AllTokenEntry[] = [];
  const pushRecord = (cat: string, rec: Record<string,string>) => {
    Object.entries(rec).forEach(([n,v]) => entries.push({ category: cat, name: n, value: v }));
  };
  pushRecord('colors', project.tokens.colors);
  pushRecord('spacing', project.tokens.spacing);
  pushRecord('radii', project.tokens.radii);
  pushRecord('shadows', project.tokens.shadows);
  // virtual typography scale tokens
  getFontSizeVirtualTokens(project).forEach(v => entries.push({ category: v.category, name: v.name, value: v.value, virtual: true, source: v.source }));
  // deterministic ordering: category then name
  return entries.sort((a,b)=> a.category === b.category ? (a.name < b.name ? -1 : a.name > b.name ? 1 : 0) : (a.category < b.category ? -1 : 1));
}
