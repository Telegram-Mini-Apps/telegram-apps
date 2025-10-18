import type { Computed } from '@tma.js/signals';
import * as E from 'fp-ts/Either';
import type { PostEventError } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';

import { createWithChecksFp, type WithChecksFp, type WithChecks } from '@/with-checks/withChecksFp.js';
import { throwifyWithChecksFp } from '@/with-checks/throwifyWithChecksFp.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import type { WithVersion } from '@/fn-options/withVersion.js';
import type { WithPostEvent } from '@/fn-options/withPostEvent.js';

export interface SwipeBehaviorState {
  isVerticalEnabled: boolean;
}

export interface SwipeBehaviorOptions
  extends WithStateRestore<SwipeBehaviorState>,
  WithVersion,
  WithPostEvent,
  SharedFeatureOptions {
}

/**
 * @since Mini Apps v7.7
 */
export class SwipeBehavior {
  constructor({ postEvent, storage, isTma, isPageReload, version }: SwipeBehaviorOptions) {
    const stateful = new Stateful({
      initialState: { isVerticalEnabled: false },
      onChange(state) {
        storage.set(state);
      },
    });
    const mountable = new Mountable({
      initialState: { isVerticalEnabled: false },
      isPageReload,
      onMounted: stateful.setState,
      restoreState: storage.get,
    });

    const wrapOptions = { requires: 'web_app_setup_swipe_behavior', isTma, version } as const;
    const wrapSupportedPlain = createWithChecksFp({
      ...wrapOptions,
      returns: 'plain',
    });
    const wrapMountedEither = createWithChecksFp({
      ...wrapOptions,
      isMounted: mountable.isMounted,
      returns: 'either',
    });

    const setVerticalEnabled = (isVerticalEnabled: boolean) => {
      const update = { isVerticalEnabled };
      if (!stateful.hasDiff(update)) {
        return E.right(undefined);
      }
      return pipe(
        postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: isVerticalEnabled }),
        E.map(() => {
          stateful.setState(update);
        }),
      );
    };

    this.isSupported = createIsSupportedSignal('web_app_setup_swipe_behavior', version);
    this.isVerticalEnabled = stateful.getter('isVerticalEnabled');
    this.isMounted = mountable.isMounted;
    this.disableVerticalFp = wrapMountedEither(() => {
      return setVerticalEnabled(false);
    });
    this.enableVerticalFp = wrapMountedEither(() => {
      return setVerticalEnabled(true);
    });
    this.mountFp = wrapSupportedPlain(() => {
      const nothing = () => undefined;
      return pipe(mountable.mount(), E.match(nothing, nothing));
    });
    this.unmount = mountable.unmount;

    this.disableVertical = throwifyWithChecksFp(this.disableVerticalFp);
    this.enableVertical = throwifyWithChecksFp(this.enableVerticalFp);
    this.mount = throwifyWithChecksFp(this.mountFp);
  }

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Signal indicating if vertical swipes are enabled.
   */
  readonly isVerticalEnabled: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v7.7
   */
  readonly mountFp: WithChecksFp<() => void, true>;

  /**
   * @see mountFp
   */
  readonly mount: WithChecks<() => void, true>;

  /**
   * Unmounts the component.
   */
  readonly unmount: () => void;

  /**
   * Disables the closing confirmation dialog.
   * @since Mini Apps v7.7
   */
  readonly disableVerticalFp: WithChecksFp<() => E.Either<PostEventError, void>, true>;

  /**
   * @see disableVerticalFp
   */
  readonly disableVertical: WithChecks<() => void, true>;

  /**
   * Enables the closing confirmation dialog.
   * @since Mini Apps v7.7
   */
  readonly enableVerticalFp: WithChecksFp<() => E.Either<PostEventError, void>, true>;

  /**
   * @see enableVerticalFp
   */
  readonly enableVertical: WithChecks<() => void, true>;
}
