import type { Computed } from '@tma.js/signals';
import * as E from 'fp-ts/Either';
import type { PostEventError } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';

import { genWithChecksTuple, type WithChecksFp, type WithChecks } from '@/wrappers/withChecksFp.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';

export interface SwipeBehaviorState {
  isVerticalEnabled: boolean;
}

export interface SwipeBehaviorOptions
  extends WithStateRestore<SwipeBehaviorState>,
  WithVersionBasedPostEvent,
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
      onMounted: bound(stateful, 'setState'),
      restoreState: storage.get,
    });

    const wrapOptions = {
      isSupported: 'web_app_setup_swipe_behavior',
      isTma,
      version,
    } as const;
    const wrapSupportedPlain = genWithChecksTuple({
      ...wrapOptions,
      returns: 'plain',
    });
    const wrapMountedEither = genWithChecksTuple({
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
    this.isVerticalEnabled = stateful.computedFromState('isVerticalEnabled');
    this.isMounted = mountable.isMounted;
    [this.disableVertical, this.disableVerticalFp] = wrapMountedEither(() => {
      return setVerticalEnabled(false);
    });
    [this.enableVertical, this.enableVerticalFp] = wrapMountedEither(() => {
      return setVerticalEnabled(true);
    });
    [this.mount, this.mountFp] = wrapSupportedPlain(mountable.mount);
    this.unmount = mountable.unmount;
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
