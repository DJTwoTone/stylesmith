import type { Project } from '../../state/store';
import { getFontSizeVirtualTokens } from '../tokens/derived';
import { UTILITY_FAMILIES } from './constants';

export interface GeneratedUtilitySegment {
  family: string;
  css: string; // raw CSS (unminified yet)
  classCount: number;
}

export interface UtilitiesOutput { segments: GeneratedUtilitySegment[]; concatenated: string; totalClasses: number; }

// Deterministic generation: iterate families in canonical order.
export function generateUtilities(project: Project): UtilitiesOutput {
  const segments: GeneratedUtilitySegment[] = [];
  for (const fam of UTILITY_FAMILIES) {
    if (fam === 'fontSize') {
      const seg = buildFontSizeUtilities(project);
      segments.push(seg);
    } else if (fam === 'spacing') {
      const seg = buildSpacingUtilities(project);
      segments.push(seg);
    } else if (fam === 'color') {
      const seg = buildColorUtilities(project);
      segments.push(seg);
    }
  }
  const concatenated = segments.map(s => s.css).join('\n');
  const totalClasses = segments.reduce((a,b)=> a + b.classCount, 0);
  return { segments, concatenated, totalClasses };
}

function buildFontSizeUtilities(project: Project): GeneratedUtilitySegment {
  const tokens = getFontSizeVirtualTokens(project);
  // class naming: .text-{tokenIndex} mapping to font-size var for future theming
  // For now, direct value; later could use CSS variables referencing tokens export.
  const lines: string[] = [];
  tokens.forEach(t => {
    // Extract index from name suffix;
    const idx = t.name.replace('font-size-','');
    lines.push(`.text-${idx}{font-size:${t.value};}`);
  });
  return { family: 'fontSize', css: lines.join(''), classCount: tokens.length };
}

// Spacing utilities: derive from project.tokens.spacing; deterministic alphabetical order
function buildSpacingUtilities(project: Project): GeneratedUtilitySegment {
  const entries = Object.entries(project.tokens.spacing).sort(([a],[b]) => a.localeCompare(b));
  const lines: string[] = [];
  // Utility naming: .m-<name>, .p-<name>, plus axis shorthands (.mx-, .my-, .mt-, .mr-, .mb-, .ml-, .px-, .py-, .pt-, ...)
  for (const [name, value] of entries) {
    lines.push(`.m-${name}{margin:${value};}`);
    lines.push(`.p-${name}{padding:${value};}`);
    // Axis & side shorthands (consistent ordering for determinism)
    lines.push(`.mx-${name}{margin-left:${value};margin-right:${value};}`);
    lines.push(`.my-${name}{margin-top:${value};margin-bottom:${value};}`);
    lines.push(`.mt-${name}{margin-top:${value};}`);
    lines.push(`.mr-${name}{margin-right:${value};}`);
    lines.push(`.mb-${name}{margin-bottom:${value};}`);
    lines.push(`.ml-${name}{margin-left:${value};}`);
    lines.push(`.px-${name}{padding-left:${value};padding-right:${value};}`);
    lines.push(`.py-${name}{padding-top:${value};padding-bottom:${value};}`);
    lines.push(`.pt-${name}{padding-top:${value};}`);
    lines.push(`.pr-${name}{padding-right:${value};}`);
    lines.push(`.pb-${name}{padding-bottom:${value};}`);
    lines.push(`.pl-${name}{padding-left:${value};}`);
  }
  return { family: 'spacing', css: lines.join(''), classCount: lines.length };
}

function buildColorUtilities(project: Project): GeneratedUtilitySegment {
  const entries = Object.entries(project.tokens.colors).sort(([a],[b])=> a.localeCompare(b));
  const lines: string[] = [];
  for (const [name,value] of entries) {
    lines.push(`.text-${name}{color:${value};}`);
    lines.push(`.bg-${name}{background-color:${value};}`);
    lines.push(`.border-${name}{border-color:${value};}`);
  }
  return { family: 'color', css: lines.join(''), classCount: lines.length };
}
