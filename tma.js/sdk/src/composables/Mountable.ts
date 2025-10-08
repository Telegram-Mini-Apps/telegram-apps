import { batch, computed, signal } from '@tma.js/signals';

import type { MaybeAccessor } from '@/types.js';
import { access } from '@/helpers/access.js';

export interface MountableOptions<S> {
  /**
   * A state to use if the `restoreState` function returned falsy value or
   * `isPageReload` returned false.
   */
  initialState: MaybeAccessor<S>;
  /**
   * @returns True if the current page was reloaded.
   */
  isPageReload: MaybeAccessor<boolean>;
  /**
   * A function to call whenever the component was mounted.
   * @param state - restored state.
   */
  onMounted?: (state: S) => void;
  /**
   * A function to call whenever the component was unmounted.
   */
  onUnmounted?: VoidFunction;
  /**
   * Attempts to restore previously saved component state. This function
   * will only be called if the current page was reloaded.
   */
  restoreState: () => (S | undefined);
}

export class Mountable<S extends object> {
  constructor({
    onMounted,
    restoreState,
    initialState,
    onUnmounted,
    isPageReload,
  }: MountableOptions<S>) {
    this.mount = () => {
      if (!this._isMounted()) {
        batch(() => {
          const state = (
            access(isPageReload) ? restoreState() : undefined
          ) || access(initialState);
          this._isMounted.set(true);
          onMounted?.(state);
        });
      }
    };

    this.unmount = () => {
      if (this._isMounted()) {
        batch(() => {
          this._isMounted.set(false);
          onUnmounted?.();
        });
      }
    };
  }

  private readonly _isMounted = signal(false);

  /**
   * Signal indicating if the component is mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Mounts the component restoring its state and calling required side effects.
   */
  readonly mount: () => void;

  /**
   * Unmounts the component.
   */
  readonly unmount: () => void;
}
