export interface TypeScaleConfig {
  base: number; // base font size in px (commonly 16)
  ratio: number; // modular scale ratio e.g., 1.25
  presets?: number[]; // optional explicit pixel sizes overriding generated scale
}

export interface TypeScaleStep { name: string; px: number; rem: string; index: number; }

// Default indices to generate when presets not supplied (relative steps around base)
const DEFAULT_INDEX_RANGE = [-2, -1, 0, 1, 2, 3, 4];

function round(value: number, precision = 4) {
  const p = Math.pow(10, precision);
  return Math.round(value * p) / p;
}

export function generateTypeScale(config: TypeScaleConfig): TypeScaleStep[] {
  if (config.presets && config.presets.length > 0) {
    return config.presets.map((px, i) => toStep(px, i));
  }
  // Generate from modular scale using index offsets
  return DEFAULT_INDEX_RANGE.map((offset, i) => {
    const px = config.base * Math.pow(config.ratio, offset);
    return toStep(px, i);
  });
}

function toStep(px: number, index: number): TypeScaleStep {
  // Use 4 decimal precision to avoid cumulative rounding drift in extremes
  const roundedPx = round(px, 4);
  // rem conversion uses 16px root assumption for determinism (document in README)
  const rem = round(roundedPx / 16, 4) + 'rem';
  return { name: `font-size-${index}`, px: roundedPx, rem, index };
}

export type HeadingLevel = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6';

export type HeadingsMap = Record<HeadingLevel, string>; // token name references like font-size-3

export function defaultHeadingsMap(steps: TypeScaleStep[]): HeadingsMap {
  // Map top 6 sizes descending to h1..h6; fallback to last if insufficient
  const sorted = [...steps].sort((a,b)=> b.px - a.px);
  const h: Partial<HeadingsMap> = {};
  const levels: HeadingLevel[] = ['h1','h2','h3','h4','h5','h6'];
  for (let i=0;i<levels.length;i++) {
    h[levels[i]] = (sorted[i] || sorted[sorted.length-1]).name;
  }
  return h as HeadingsMap;
}

export interface HeadingsValidationResult { ok: boolean; errors?: { level: HeadingLevel; message: string }[] }

export function validateHeadingsMap(map: HeadingsMap, availableTokenNames: string[]): HeadingsValidationResult {
  const errors: { level: HeadingLevel; message: string }[] = [];
  const set = new Set(availableTokenNames);
  (Object.keys(map) as HeadingLevel[]).forEach(level => {
    if (!set.has(map[level])) {
      errors.push({ level, message: `Heading ${level.toUpperCase()} references missing token ${map[level]}` });
    }
  });
  if (errors.length) return { ok: false, errors };
  return { ok: true };
}
