import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithPostEvent, WithVersion } from '@/features/types.js';
import { ButtonLike, ButtonLikeOptions } from '@/composites/ButtonLike.js';

export interface BackButtonState {
  isVisible: boolean;
}

export interface BackButtonOptions extends WithVersion,
  WithPostEvent,
  Omit<ButtonLikeOptions<BackButtonState>, 'onChange' | 'initialState'> {
}

/**
 * @since Mini Apps v6.1
 */
export class BackButton {
  constructor({ postEvent, version, isTma, ...rest }: BackButtonOptions) {
    const buttonLike = new ButtonLike({
      ...rest,
      initialState: { isVisible: false },
      isTma,
      onChange(state) {
        postEvent('web_app_setup_back_button', { is_visible: state.isVisible });
      },
    });

    const wrapOptions = { version, isSupported: 'web_app_setup_back_button', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: buttonLike.isMounted,
    });

    const setVisibility = (isVisible: boolean): void => {
      buttonLike.setState({ isVisible });
    };

    this.isVisible = buttonLike.isVisible;
    this.isMounted = buttonLike.isMounted;
    this.isSupported = createIsSupportedSignal('web_app_setup_back_button', version);
    this.hide = wrapComplete(() => setVisibility(false));
    this.show = wrapComplete(() => setVisibility(true));
    this.onClick = wrapSupported(buttonLike.onClick);
    this.offClick = wrapSupported(buttonLike.offClick);
    this.mount = wrapSupported(buttonLike.mount);
    this.unmount = buttonLike.unmount;
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
  hide: SafeWrapped<() => void, true>;

  /**
   * Shows the back button.
   * @since Mini Apps v6.1
   */
  show: SafeWrapped<() => void, true>;

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
  readonly onClick: SafeWrapped<
    (listener: VoidFunction, once?: boolean) => VoidFunction,
    true
  >;

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
  readonly offClick: SafeWrapped<
    (listener: VoidFunction, once?: boolean) => void,
    true
  >;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v6.1
   */
  readonly mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}
