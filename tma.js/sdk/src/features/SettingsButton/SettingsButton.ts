import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { WithPostEvent, WithVersion } from '@/features/mixins.js';
import { Button, type ButtonOptions } from '@/composables/Button.js';

export interface SettingsButtonState {
  isVisible: boolean;
}

export interface SettingsButtonOptions extends WithVersion,
  WithPostEvent,
  Omit<ButtonOptions<SettingsButtonState>, 'onChange' | 'initialState'> {
}

/**
 * @since Mini Apps v6.10
 */
export class SettingsButton {
  constructor({ postEvent, version, isTma, ...rest }: SettingsButtonOptions) {
    const button = new Button({
      ...rest,
      initialState: { isVisible: false },
      isTma,
      onChange(state) {
        postEvent('web_app_setup_settings_button', { is_visible: state.isVisible });
      },
    });

    const wrapOptions = {
      version,
      isSupported: 'web_app_setup_settings_button',
      isTma,
    } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: button.isMounted,
    });

    const setVisibility = (isVisible: boolean): void => {
      button.setState({ isVisible });
    };

    this.isVisible = button.isVisible;
    this.isMounted = button.isMounted;
    this.isSupported = createIsSupportedSignal('web_app_setup_settings_button', version);
    this.hide = wrapComplete(() => setVisibility(false));
    this.show = wrapComplete(() => setVisibility(true));
    this.onClick = wrapSupported(button.onClick);
    this.offClick = wrapSupported(button.offClick);
    this.mount = wrapSupported(button.mount);
    this.unmount = button.unmount;
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
   * Hides the settings button.
   * @since Mini Apps v6.10
   */
  hide: SafeWrapped<() => void, true>;

  /**
   * Shows the settings button.
   * @since Mini Apps v6.10
   */
  show: SafeWrapped<() => void, true>;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v6.10
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
   * @since Mini Apps v6.10
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
   * @since Mini Apps v6.10
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
