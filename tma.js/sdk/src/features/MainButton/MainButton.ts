import type { Computed } from '@tma.js/signals';
import type { RGB } from '@tma.js/types';

import {
  BottomButton,
  type BottomButtonOptions,
  type BottomButtonState,
} from '@/composites/BottomButton.js';
import type { WithPostEvent, WithVersion } from '@/features/types.js';
import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';

export type MainButtonState = BottomButtonState;

export interface MainButtonOptions extends WithVersion,
  WithPostEvent,
  Pick<
    BottomButtonOptions<MainButtonState>,
    'isTma' | 'storage' | 'onClick' | 'offClick' | 'defaults'
  > {
}

export class MainButton {
  constructor({ version, postEvent, isTma, ...rest }: MainButtonOptions) {
    const button = new BottomButton<MainButtonState>({
      ...rest,
      isTma,
      initialState: {
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: false,
        isVisible: false,
        text: 'Continue',
      },
      onChange(state) {
        postEvent('web_app_setup_main_button', {
          has_shine_effect: state.hasShineEffect,
          is_visible: state.isVisible,
          is_active: state.isEnabled,
          is_progress_visible: state.isLoaderVisible,
          text: state.text,
          color: state.textColor,
          text_color: state.textColor,
        });
      },
    });

    const wrapOptions = { isTma, version };
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapMounted = createWrapSafe({
      ...wrapOptions,
      isMounted: button.isMounted,
    });

    this.bgColor = button.bgColor;
    this.hasShineEffect = button.hasShineEffect;
    this.isEnabled = button.isEnabled;
    this.isLoaderVisible = button.isLoaderVisible;
    this.text = button.text;
    this.textColor = button.textColor;
    this.isVisible = button.isVisible;
    this.isMounted = button.isMounted;
    this.state = button.state;

    this.setParams = wrapMounted(button.setParams);
    this.mount = wrapSupported(button.mount);
    this.unmount = button.unmount;
    this.onClick = wrapSupported(button.onClick);
    this.offClick = wrapSupported(button.offClick);
  }

  /**
   * The button background color.
   */
  readonly bgColor: Computed<RGB>;

  /**
   * True if the button has a shining effect.
   */
  readonly hasShineEffect: Computed<boolean>;

  /**
   * True if the button is clickable.
   */
  readonly isEnabled: Computed<boolean>;

  /**
   * True if the button loader is visible.
   */
  readonly isLoaderVisible: Computed<boolean>;

  /**
   * True if the button is visible.
   */
  readonly isVisible: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * The complete button state.
   */
  readonly state: Computed<MainButtonState>;

  /**
   * The button displayed text.
   */
  readonly text: Computed<string>;

  /**
   * The button text color.
   *
   * Note that this value is computed based on the external defaults. For
   * example, if not explicitly set, this value may be equal to one of theme
   * params colors.
   */
  readonly textColor: Computed<RGB>;

  /**
   * Updates the button state.
   * @param state - updates to apply.
   * @example
   * button.setParams({
   *   text: 'Submit',
   *   isEnabled: true,
   *   hasShineEffect: true,
   * });
   */
  readonly setParams: SafeWrapped<(state: Partial<MainButtonState>) => void, false>;

  /**
   * Mounts the component restoring its state.
   */
  readonly mount: SafeWrapped<() => void, false>;

  /**
   * Unmounts the component.
   */
  readonly unmount: () => void;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @example
   * const off = button.onClick(() => {
   *   console.log('User clicked the button');
   *   off();
   * });
   */
  readonly onClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => VoidFunction, false>;

  /**
   * Removes the button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @example
   * function listener() {
   *   console.log('User clicked the button');
   *   button.offClick(listener);
   * }
   * button.onClick(listener);
   */
  readonly offClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => void, false>;
}
