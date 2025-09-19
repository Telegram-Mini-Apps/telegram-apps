import { batch, computed, signal } from '@tma.js/signals';

import type { SharedFeatureOptions } from '@/features/types.js';
import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';

export interface MountableOptions<S> extends SharedFeatureOptions {
  /**
   * Attempts to restore the component state.
   */
  restoreState: () => (S | undefined);
  /**
   * A function to call whenever the state was restored during the mount.
   * @param state - restored state.
   */
  onStateRestored: (state: S) => void;
}

export class Mountable<S extends object> {
  constructor({ onStateRestored, restoreState, ...rest }: MountableOptions<S>) {
    const wrapSafe = createWrapSafe(rest);

    this.mount = wrapSafe(() => {
      if (!this._isMounted()) {
        batch(() => {
          const state = isPageReload() ? restoreState() : undefined;
          if (state) {
            onStateRestored(state);
          }
          this._isMounted.set(true);
        });
      }
    });
  }

  protected readonly _isMounted = signal(false);

  /**
   * Signal indicating if the component is mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Mounts the component restoring its state and calling required side
   * effects.
   */
  mount: SafeWrapped<VoidFunction, false>;

  /**
   * Unmounts the component.
   */
  unmount() {
    this._isMounted.set(false);
  }
}
