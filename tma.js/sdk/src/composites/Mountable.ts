import { batch, computed, signal } from '@tma.js/signals';

import { isPageReload } from '@/navigation.js';
import type { MaybeAccessor } from '@/types.js';
import { access } from '@/helpers/access.js';

type RestoreStateFn<S> = () => (S | undefined);

type OnMounted<S> = (state: S) => void;

export interface MountableOptions<S> {
  /**
   * A state to use when the current application launch is fresh (page
   * was not reloaded) or `restoreState` returned falsy value.
   */
  fallbackState: MaybeAccessor<S>;
  /**
   * A function to call whenever the component was mounted.
   * @param state - restored state.
   */
  onMounted?: OnMounted<S>;
  /**
   * A function to call whenever the component was unmounted.
   */
  onUnmounted?: VoidFunction;
  /**
   * Attempts to restore previously saved component state. This function
   * will only be called if the current page was reloaded.
   */
  restoreState: RestoreStateFn<S>;
}

export class Mountable<S extends object> {
  constructor({ onMounted, restoreState, fallbackState, onUnmounted }: MountableOptions<S>) {
    this.restoreState = restoreState;
    this.onMounted = onMounted;
    this.onUnmounted = onUnmounted;
    this.fallbackState = fallbackState;
  }

  private readonly fallbackState: MaybeAccessor<S>;

  private readonly restoreState: RestoreStateFn<S>;

  private readonly onMounted?: OnMounted<S>;

  private readonly onUnmounted?: VoidFunction;

  private readonly _isMounted = signal(false);

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
        const state = (isPageReload() ? this.restoreState() : undefined)
          || access(this.fallbackState);
        this._isMounted.set(true);
        this.onMounted?.(state);
      });
    }
  }

  /**
   * Unmounts the component.
   */
  unmount() {
    if (this._isMounted()) {
      batch(() => {
        this._isMounted.set(false);
        this.onUnmounted?.();
      });
    }
  }
}
