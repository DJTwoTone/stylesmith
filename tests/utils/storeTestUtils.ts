import { useStore, type StoreState } from '../../src/state/store';

// Ensures a project exists. If absent, creates one with provided or default name.
export function ensureProject(name: string = 'TestProject') {
  const state = useStore.getState();
  if (!state.currentProject) {
    state.createProject(name);
  }
  return useStore.getState().currentProject!;
}

// Resets the store to initial empty state (helpful for isolation). Zustand does not expose a built-in reset,
// so we re-apply initial shape manually.
export function resetStore() {
  // Narrow cast to access internal setState without pervasive any.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - setState exists on the store function; we supply the partial shape.
  (useStore as unknown as { setState: (partial: Partial<StoreState>) => void }).setState({ currentProject: null });
}
