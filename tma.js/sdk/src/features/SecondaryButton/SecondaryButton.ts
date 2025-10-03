import type { SecondaryButtonPosition } from '@tma.js/bridge';
import { computed, type Computed } from '@tma.js/signals';
import type { RGB } from '@tma.js/types';

import {
  BottomButton,
  type BottomButtonOptions,
  type BottomButtonState,
} from '@/composables/BottomButton.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';

export interface SecondaryButtonState extends BottomButtonState {
  position: SecondaryButtonPosition;
}

export interface SecondaryButtonOptions extends WithVersionBasedPostEvent,
  SharedFeatureOptions,
  Omit<BottomButtonOptions<SecondaryButtonState>, 'initialState' | 'onChange'> {
}

/**
 * @since Mini Apps v7.10
 */
export class SecondaryButton {
  constructor({ version, postEvent, isTma, ...rest }: SecondaryButtonOptions) {
    const button = new BottomButton<SecondaryButtonState>({
      ...rest,
      initialState: {
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: false,
        isVisible: false,
        text: 'Cancel',
        position: 'left',
      },
      onChange(state) {
        postEvent('web_app_setup_secondary_button', {
          has_shine_effect: state.hasShineEffect,
          is_visible: state.isVisible,
          is_active: state.isEnabled,
          is_progress_visible: state.isLoaderVisible,
          text: state.text,
          color: state.bgColor,
          text_color: state.textColor,
          position: state.position,
        });
      },
    });

    const wrapOptions = {
      isTma,
      isSupported: 'web_app_setup_secondary_button',
      version,
    } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapMounted = createWrapSafe({
      ...wrapOptions,
      isMounted: button.isMounted,
    });

    this.isSupported = createIsSupportedSignal('web_app_setup_secondary_button', version);
    this.position = computed(() => button.state().position);
    this.bgColor = button.bgColor;
    this.hasShineEffect = button.hasShineEffect;
    this.isEnabled = button.isEnabled;
    this.isLoaderVisible = button.isLoaderVisible;
    this.text = button.text;
    this.textColor = button.textColor;
    this.isVisible = button.isVisible;
    this.isMounted = button.isMounted;
    this.state = button.state;

    this.show = wrapMounted(button.show);
    this.hide = wrapMounted(button.hide);
    this.setParams = wrapMounted(button.setParams);
    this.mount = wrapSupported(button.mount);
    this.unmount = button.unmount;
    this.onClick = wrapSupported(button.onClick);
    this.offClick = wrapSupported(button.offClick);
    this.enable = wrapMounted(button.enable);
    this.disable = wrapMounted(button.disable);
    this.enableShineEffect = wrapMounted(button.enableShineEffect);
    this.disableShineEffect = wrapMounted(button.disableShineEffect);
    this.showLoader = wrapMounted(button.showLoader);
    this.hideLoader = wrapMounted(button.hideLoader);
    this.setText = wrapMounted(button.setText);
    this.setTextColor = wrapMounted(button.setTextColor);
    this.setBgColor = wrapMounted(button.setBgColor);
    this.setPosition = wrapMounted(position => {
      button.setParams({ position });
    });
  }

  //#region Properties.
  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * The button position relative to the main one.
   */
  readonly position: Computed<SecondaryButtonPosition>;

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
  readonly state: Computed<SecondaryButtonState>;

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
  //#endregion

  //#region Methods.
  /**
   * Shows the button.
   * @since Mini Apps v7.10
   */
  readonly show: SafeWrapped<() => void, true>;

  /**
   * Hides the button.
   * @since Mini Apps v7.10
   */
  readonly hide: SafeWrapped<() => void, true>;

  /**
   * Enables the button.
   * @since Mini Apps v7.10
   */
  readonly enable: SafeWrapped<() => void, true>;

  /**
   * Enables the button.
   * @since Mini Apps v7.10
   */
  readonly enableShineEffect: SafeWrapped<() => void, true>;

  /**
   * Disables the button.
   * @since Mini Apps v7.10
   */
  readonly disable: SafeWrapped<() => void, true>;

  /**
   * Enables the button.
   * @since Mini Apps v7.10
   */
  readonly disableShineEffect: SafeWrapped<() => void, true>;

  /**
   * Updates the button background color.
   * @since Mini Apps v7.10
   */
  readonly setBgColor: SafeWrapped<(value: RGB) => void, true>;

  /**
   * Updates the button text color.
   * @since Mini Apps v7.10
   */
  readonly setTextColor: SafeWrapped<(value: RGB) => void, true>;

  /**
   * Updates the button text.
   * @since Mini Apps v7.10
   */
  readonly setText: SafeWrapped<(value: string) => void, true>;

  /**
   * Updates the button position.
   * @since Mini Apps v7.10
   */
  readonly setPosition: SafeWrapped<(position: SecondaryButtonPosition) => void, true>;

  /**
   * Shows the button loader.
   * @since Mini Apps v7.10
   */
  readonly showLoader: SafeWrapped<() => void, true>;

  /**
   * Hides the button loader.
   * @since Mini Apps v7.10
   */
  readonly hideLoader: SafeWrapped<() => void, true>;

  /**
   * Updates the button state.
   * @param state - updates to apply.
   * @since Mini Apps v7.10
   * @example
   * button.setParams({
   *   text: 'Submit',
   *   isEnabled: true,
   *   hasShineEffect: true,
   * });
   */
  readonly setParams: SafeWrapped<
    (state: Partial<SecondaryButtonState>) => void,
    true
  >;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v7.10
   */
  readonly mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   */
  readonly unmount: () => void;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v7.10
   * @example
   * const off = button.onClick(() => {
   *   console.log('User clicked the button');
   *   off();
   * });
   */
  readonly onClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => VoidFunction, true>;

  /**
   * Removes the button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @since Mini Apps v7.10
   * @example
   * function listener() {
   *   console.log('User clicked the button');
   *   button.offClick(listener);
   * }
   * button.onClick(listener);
   */
  readonly offClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => void, true>;
  //#endregion
}
