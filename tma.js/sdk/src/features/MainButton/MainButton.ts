import type { Computed } from '@tma.js/signals';
import type { RGB } from '@tma.js/types';
import type { PostEventError } from '@tma.js/bridge';
import * as E from 'fp-ts/Either';

import {
  BottomButton,
  type BottomButtonOptions,
  type BottomButtonState,
} from '@/composables/BottomButton.js';
import { createWithChecksFp, type WithChecks, type WithChecksFp } from '@/wrappers/withChecksFp.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import type { WithPostEvent } from '@/fn-options/withPostEvent.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

type MainButtonEither = E.Either<PostEventError, void>;

export type MainButtonState = BottomButtonState;

export interface MainButtonOptions extends WithPostEvent,
  SharedFeatureOptions,
  Omit<BottomButtonOptions<MainButtonState, PostEventError>, 'initialState' | 'onChange' | 'commit'> {
}

export class MainButton {
  constructor({ postEvent, isTma, ...rest }: MainButtonOptions) {
    const button = new BottomButton<MainButtonState, PostEventError>({
      ...rest,
      initialState: {
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: false,
        isVisible: false,
        text: 'Continue',
      },
      commit(state) {
        return postEvent('web_app_setup_main_button', {
          has_shine_effect: state.hasShineEffect,
          is_visible: state.isVisible,
          is_active: state.isEnabled,
          is_progress_visible: state.isLoaderVisible,
          text: state.text,
          color: state.bgColor,
          text_color: state.textColor,
        });
      },
    });

    const wrapOptions = { isTma };
    const wrapSupportedPlain = createWithChecksFp({
      ...wrapOptions,
      returns: 'plain',
    });
    const wrapMountedEither = createWithChecksFp({
      ...wrapOptions,
      returns: 'either',
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

    this.showFp = wrapMountedEither(button.show);
    this.hideFp = wrapMountedEither(button.hide);
    this.setParamsFp = wrapMountedEither(button.setParams);
    this.mountFp = wrapSupportedPlain(button.mount);
    this.unmount = button.unmount;
    this.onClickFp = wrapSupportedPlain(button.onClick);
    this.offClickFp = wrapSupportedPlain(button.offClick);
    this.enableFp = wrapMountedEither(button.enable);
    this.disableFp = wrapMountedEither(button.disable);
    this.enableShineEffectFp = wrapMountedEither(button.enableShineEffect);
    this.disableShineEffectFp = wrapMountedEither(button.disableShineEffect);
    this.showLoaderFp = wrapMountedEither(button.showLoader);
    this.hideLoaderFp = wrapMountedEither(button.hideLoader);
    this.setTextFp = wrapMountedEither(button.setText);
    this.setTextColorFp = wrapMountedEither(button.setTextColor);
    this.setBgColorFp = wrapMountedEither(button.setBgColor);

    this.show = throwifyWithChecksFp(this.showFp);
    this.hide = throwifyWithChecksFp(this.hideFp);
    this.setParams = throwifyWithChecksFp(this.setParamsFp);
    this.mount = throwifyWithChecksFp(this.mountFp);
    this.onClick = throwifyWithChecksFp(this.onClickFp);
    this.offClick = throwifyWithChecksFp(this.offClickFp);
    this.enable = throwifyWithChecksFp(this.enableFp);
    this.disable = throwifyWithChecksFp(this.disableFp);
    this.enableShineEffect = throwifyWithChecksFp(this.enableShineEffectFp);
    this.disableShineEffect = throwifyWithChecksFp(this.disableShineEffectFp);
    this.showLoader = throwifyWithChecksFp(this.showLoaderFp);
    this.hideLoader = throwifyWithChecksFp(this.hideLoaderFp);
    this.setText = throwifyWithChecksFp(this.setTextFp);
    this.setTextColor = throwifyWithChecksFp(this.setTextColorFp);
    this.setBgColor = throwifyWithChecksFp(this.setBgColorFp);
  }

  //#region Properties.
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
  //#endregion

  //#region Methods.
  /**
   * Shows the button.
   */
  readonly showFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see showFp
   */
  readonly show: WithChecks<() => void, false>;

  /**
   * Hides the button.
   */
  readonly hideFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see hideFp
   */
  readonly hide: WithChecks<() => void, false>;

  /**
   * Enables the button.
   */
  readonly enableFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see enableFp
   */
  readonly enable: WithChecks<() => void, false>;

  /**
   * Enables the button.
   */
  readonly enableShineEffectFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see enableShineEffectFp
   */
  readonly enableShineEffect: WithChecks<() => void, false>;

  /**
   * Disables the button.
   */
  readonly disableFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see disableFp
   */
  readonly disable: WithChecks<() => void, false>;

  /**
   * Enables the button.
   */
  readonly disableShineEffectFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see disableShineEffectFp
   */
  readonly disableShineEffect: WithChecks<() => void, false>;

  /**
   * Updates the button background color.
   */
  readonly setBgColorFp: WithChecksFp<(value: RGB) => MainButtonEither, false>;

  /**
   * @see setBgColorFp
   */
  readonly setBgColor: WithChecks<(value: RGB) => void, false>;

  /**
   * Updates the button text color.
   */
  readonly setTextColorFp: WithChecksFp<(value: RGB) => MainButtonEither, false>;

  /**
   * @see setTextColorFp
   */
  readonly setTextColor: WithChecks<(value: RGB) => void, false>;

  /**
   * Updates the button text.
   */
  readonly setTextFp: WithChecksFp<(value: string) => MainButtonEither, false>;

  /**
   * @see setTextFp
   */
  readonly setText: WithChecks<(value: string) => void, false>;

  /**
   * Shows the button loader.
   */
  readonly showLoaderFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see showLoaderFp
   */
  readonly showLoader: WithChecks<() => void, false>;

  /**
   * Hides the button loader.
   */
  readonly hideLoaderFp: WithChecksFp<() => MainButtonEither, false>;

  /**
   * @see hideLoaderFp
   */
  readonly hideLoader: WithChecks<() => void, false>;

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
  readonly setParamsFp: WithChecksFp<
    (state: Partial<MainButtonState>) => MainButtonEither,
    false
  >;

  readonly setParams: WithChecks<(state: Partial<MainButtonState>) => void, false>;

  /**
   * Mounts the component restoring its state.
   */
  readonly mountFp: WithChecksFp<() => void, false>;

  /**
   * @see mountFp
   */
  readonly mount: WithChecks<() => void, false>;

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
  readonly onClickFp: WithChecksFp<(listener: VoidFunction, once?: boolean) => VoidFunction, false>;

  /**
   * @see onClickFp
   */
  readonly onClick: WithChecks<(listener: VoidFunction, once?: boolean) => VoidFunction, false>;

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
  readonly offClickFp: WithChecksFp<(listener: VoidFunction, once?: boolean) => void, false>;

  /**
   * @see offClickFp
   */
  readonly offClick: WithChecks<(listener: VoidFunction, once?: boolean) => void, false>;
  //#endregion
}
