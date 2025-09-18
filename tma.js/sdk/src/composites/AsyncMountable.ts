import { batch, computed, signal } from '@tma.js/signals';
import { BetterPromise } from 'better-promises';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import type { SharedFeatureOptions } from '@/features/types.js';
import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import type { AsyncOptions } from '@/types.js';

export interface AsyncMountableOptions<S, E> extends SharedFeatureOptions {
  /**
   * Attempts to restore the component state.
   */
  restoreState: () => (S | undefined);
  /**
   * A function to call right before the mount flag update.
   * @param state - restored state.
   */
  onBeforeMounted: (state: S) => void;
  /**
   * A function to call after mount.
   */
  onMounted: () => void;
  /**
   * A function to call after unmount.
   */
  onUnmounted: () => void;
  /**
   * A function to retrieve the initial state.
   * @param options - additional options.
   */
  mount: (options?: AsyncOptions) => TE.TaskEither<E, S>;
}

export class AsyncMountable<S extends object, E> {
  constructor({
    onBeforeMounted,
    mount,
    restoreState,
    onMounted,
    onUnmounted,
    isTma,
  }: AsyncMountableOptions<S, E>) {
    const wrapSafe = createWrapSafe({ isTma });

    this.mount = wrapSafe(options => {
      if (this._isMounted()) {
        return BetterPromise.resolve();
      }

      const processResult = (state: S) => {
        // The user could call mount several times in a row while the
        // component was still mounting. We should prevent calling the
        // same hooks several times in this case.
        if (this._isMounted()) {
          return;
        }
        batch(() => {
          onBeforeMounted(state);
          this._isMounted.set(true);
        });
      };

      const state = isPageReload() ? restoreState() : undefined;
      if (state) {
        return BetterPromise.resolve(state).then(processResult);
      }

      return BetterPromise.fn(async () => {
        await pipe(mount(options), TE.match(
          error => {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw error;
          },
          processResult,
        ))();
      });
    });

    this.isMounted.sub(isMounted => {
      if (isMounted) {
        onMounted();
      } else {
        onUnmounted();
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
   * @param options - additional execution options.
   */
  mount: SafeWrapped<(options?: AsyncOptions) => BetterPromise<void>, false>;

  /**
   * Unmounts the component.
   */
  unmount() {
    this._isMounted.set(false);
  }
}
