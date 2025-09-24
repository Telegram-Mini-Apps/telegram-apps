import { batch, computed, signal } from '@tma.js/signals';
import { BetterPromise } from 'better-promises';
import * as TE from 'fp-ts/TaskEither';

import type { AsyncOptions, MaybeAccessor } from '@/types.js';
import { teToPromise } from '@/helpers/teToPromise.js';
import { access } from '@/helpers/access.js';

type RestoreStateFn<S> = () => (S | undefined);

type OnMounted<S> = (state: S) => void;

type InitialStateFn<S, E> = (options?: AsyncOptions) => TE.TaskEither<E, S>;

export interface AsyncMountableOptions<S, E> {
  /**
   * @returns True if the current page was reloaded.
   */
  isPageReload: MaybeAccessor<boolean>;
  /**
   * A function to retrieve the initial state.
   * @param options - additional options.
   */
  initialState: InitialStateFn<S, E>;
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

export class AsyncMountable<S extends object, E> {
  constructor({
    initialState,
    onMounted,
    restoreState,
    onUnmounted,
    isPageReload,
  }: AsyncMountableOptions<S, E>) {
    this.restoreState = restoreState;
    this.onMounted = onMounted;
    this.onUnmounted = onUnmounted;
    this.isPageReload = isPageReload;
    this.initialState = initialState;
  }

  private readonly restoreState: RestoreStateFn<S>;

  private readonly onMounted?: OnMounted<S>;

  private readonly onUnmounted?: VoidFunction;

  private readonly isPageReload: MaybeAccessor<boolean>;

  private readonly initialState: InitialStateFn<S, E>;

  private readonly _isMounted = signal(false);

  /**
   * Signal indicating if the component is mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Mounts the component restoring its state and calling required side
   * effects.
   * @param options - additional execution options.
   */
  mount(options?: AsyncOptions): BetterPromise<void> {
    return this._isMounted()
      ? BetterPromise.resolve()
      : BetterPromise
        .fn(() => {
          return (
            access(this.isPageReload) ? this.restoreState() : undefined
          ) || teToPromise(this.initialState(options));
        })
        .then(state => {
          // The user could call mount several times in a row while the
          // component was still mounting. We should prevent calling the
          // same hooks several times in this case.
          if (!this._isMounted()) {
            batch(() => {
              this._isMounted.set(true);
              this.onMounted?.(state);
            });
          }
        });
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
