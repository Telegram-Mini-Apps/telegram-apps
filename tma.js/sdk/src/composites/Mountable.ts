import { batch, computed, signal } from '@tma.js/signals';

import { isPageReload } from '@/navigation.js';

type RestoreStateFn<S> = () => (S | undefined);

type OnStateRestoredFn<S> = (state: S) => void;

export interface MountableOptions<S> {
  /**
   * Attempts to restore the component state.
   */
  restoreState: RestoreStateFn<S>;
  /**
   * A function to call whenever the state was restored during the mount.
   * @param state - restored state.
   */
  onStateRestored: OnStateRestoredFn<S>;
}

export class Mountable<S extends object> {
  constructor({ onStateRestored, restoreState }: MountableOptions<S>) {
    this.restoreState = restoreState;
    this.onStateRestored = onStateRestored;
  }

  private readonly restoreState: RestoreStateFn<S>;

  private readonly onStateRestored: OnStateRestoredFn<S>;

  protected readonly _isMounted = signal(false);

  /**
   * Signal indicating if the component is mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Mounts the component restoring its state and calling required side
   * effects.
   */
  mount() {
    if (!this._isMounted()) {
      batch(() => {
        const state = isPageReload() ? this.restoreState() : undefined;
        if (state) {
          this.onStateRestored(state);
        }
        this._isMounted.set(true);
      });
    }
  }

  /**
   * Unmounts the component.
   */
  unmount() {
    this._isMounted.set(false);
  }
}
