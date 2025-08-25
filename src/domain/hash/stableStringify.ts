// Deterministic JSON stringify: sorts object keys recursively.
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: any): any {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, any>>((acc, k) => {
        acc[k] = sortValue(value[k]);
        return acc;
      }, {});
  }
  return value;
}
