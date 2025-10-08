import type { Computed } from '@tma.js/signals';
import * as E from 'fp-ts/Either';
import type { PostEventError } from '@tma.js/bridge';

import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import { Button, type ButtonOptions } from '@/composables/Button.js';
import { createWithChecksFp, type WithChecksFp, type WithChecks } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';

export interface BackButtonState {
  isVisible: boolean;
}

export interface BackButtonOptions extends WithVersionBasedPostEvent,
  SharedFeatureOptions,
  Omit<ButtonOptions<BackButtonState, PostEventError>, 'onChange' | 'initialState' | 'commit'> {
}

/**
 * @since Mini Apps v6.1
 */
export class BackButton {
  constructor({ postEvent, version, isTma, ...rest }: BackButtonOptions) {
    const SETUP_METHOD = 'web_app_setup_back_button';
    const button = new Button({
      ...rest,
      initialState: { isVisible: false },
      commit(state) {
        return postEvent(SETUP_METHOD, { is_visible: state.isVisible });
      },
    });

    const wrapOptions = { version, isSupported: SETUP_METHOD, isTma } as const;
    const wrapSupportedPlain = createWithChecksFp({
      ...wrapOptions,
      returns: 'plain',
    });
    const wrapMountedEither = createWithChecksFp({
      ...wrapOptions,
      returns: 'either',
      isMounted: button.isMounted,
    });

    this.isVisible = button.isVisible;
    this.isMounted = button.isMounted;
    this.isSupported = createIsSupportedSignal(SETUP_METHOD, version);
    this.hideFp = wrapMountedEither(button.hide);
    this.showFp = wrapMountedEither(button.show);
    this.onClickFp = wrapSupportedPlain(button.onClick);
    this.offClickFp = wrapSupportedPlain(button.offClick);
    this.mountFp = wrapSupportedPlain(button.mount);
    this.unmount = button.unmount;

    this.hide = throwifyWithChecksFp(this.hideFp);
    this.show = throwifyWithChecksFp(this.showFp);
    this.onClick = throwifyWithChecksFp(this.onClickFp);
    this.offClick = throwifyWithChecksFp(this.offClickFp);
    this.mount = throwifyWithChecksFp(this.mountFp);
  }

  /**
   * Signal indicating if the component is currently visible.
   */
  readonly isVisible: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Hides the back button.
   * @since Mini Apps v6.1
   */
  readonly hideFp: WithChecksFp<() => E.Either<PostEventError, void>, true>;

  /**
   * @see hideFp
   */
  readonly hide: WithChecks<() => void, true>;

  /**
   * Shows the back button.
   * @since Mini Apps v6.1
   */
  readonly showFp: WithChecksFp<() => E.Either<PostEventError, void>, true>;

  /**
   * @see showFp
   */
  readonly show: WithChecks<() => void, true>;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v6.1
   * @example
   * const off = button.onClick(() => {
   *   console.log('User clicked the button');
   *   off();
   * });
   */
  readonly onClickFp: WithChecksFp<
    (listener: VoidFunction, once?: boolean) => VoidFunction,
    true
  >;

  /**
   * @see onClickFp
   */
  readonly onClick: WithChecks<(listener: VoidFunction, once?: boolean) => VoidFunction, true>;

  /**
   * Removes the button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @since Mini Apps v6.1
   * @example
   * function listener() {
   *   console.log('User clicked the button');
   *   button.offClick(listener);
   * }
   * button.onClick(listener);
   */
  readonly offClickFp: WithChecksFp<
    (listener: VoidFunction, once?: boolean) => void,
    true
  >;

  /**
   * @see offClickFp
   */
  readonly offClick: WithChecks<(listener: VoidFunction, once?: boolean) => void, true>;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v6.1
   */
  readonly mountFp: WithChecksFp<() => void, true>;

  /**
   * @see mountFp
   */
  readonly mount: WithChecks<() => void, true>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}
