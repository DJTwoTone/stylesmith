// Canonical order of utility families (expand as more are added)
export const UTILITY_FAMILIES = [
  'fontSize',
  'spacing',
  'color',
  // future: 'color', 'radius', 'shadow'
] as const;

export type UtilityFamily = typeof UTILITY_FAMILIES[number];
