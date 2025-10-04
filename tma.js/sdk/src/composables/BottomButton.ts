import { computed, type Computed } from '@tma.js/signals';
import type { RGB } from '@tma.js/types';
import * as E from 'fp-ts/Either';

import type { MaybeAccessor } from '@/types.js';
import { access } from '@/helpers/access.js';
import { Button, type ButtonOptions, type ButtonState } from '@/composables/Button.js';

export interface BottomButtonState extends ButtonState {
  bgColor?: RGB;
  hasShineEffect: boolean;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  text: string;
  textColor?: RGB;
}

type BottomButtonStateBoolFields = {
  [K in keyof BottomButtonState]-?: BottomButtonState[K] extends boolean ? K : never;
}[keyof BottomButtonState];

export interface BottomButtonOptions<S, Err> extends ButtonOptions<S, Err> {
  /**
   * Default values for different kinds of the button properties.
   */
  defaults: {
    bgColor: MaybeAccessor<RGB>;
    textColor: MaybeAccessor<RGB>;
  };
}

export class BottomButton<S extends BottomButtonState, Err> {
  constructor({ defaults, ...rest }: BottomButtonOptions<S, Err>) {
    const button = new Button(rest);

    const computedFromState = <K extends keyof S>(key: K): Computed<S[K]> => {
      return computed(() => button.state()[key]);
    };
    const withDefault = (
      field: 'bgColor' | 'textColor',
      getDefault: MaybeAccessor<RGB>,
    ) => {
      const fromState = computedFromState(field);
      return computed(() => {
        return fromState() || access(getDefault);
      });
    };
    const createSetter = <K extends keyof BottomButtonState>(key: K) => {
      return (value: BottomButtonState[K]) => {
        return button.setState({ [key]: value } as Record<K, BottomButtonState[K]> as Partial<S>);
      };
    };
    const createBoolSetters = <K extends BottomButtonStateBoolFields>(key: K) => {
      const set = createSetter(key);
      return [
        () => set(true),
        () => set(false),
      ];
    };

    this.bgColor = withDefault('bgColor', defaults.bgColor);
    this.hasShineEffect = computedFromState('hasShineEffect');
    this.isEnabled = computedFromState('isEnabled');
    this.isLoaderVisible = computedFromState('isLoaderVisible');
    this.isVisible = button.isVisible;
    this.isMounted = button.isMounted;
    this.text = computedFromState('text');
    this.textColor = withDefault('textColor', defaults.textColor);
    this.state = button.state;

    this.mount = button.mount;
    this.unmount = button.unmount;
    this.setParams = button.setState;
    this.onClick = button.onClick;
    this.offClick = button.offClick;
    this.hide = button.hide;
    this.show = button.show;
    [this.enable, this.disable] = createBoolSetters('isEnabled');
    [this.enableShineEffect, this.disableShineEffect] = createBoolSetters('hasShineEffect');
    [this.showLoader, this.hideLoader] = createBoolSetters('isLoaderVisible');
    this.setText = createSetter('text');
    this.setTextColor = createSetter('textColor');
    this.setBgColor = createSetter('bgColor');
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
  readonly state: Computed<S>;

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
   * Updates the button state.
   * @param state - updates to apply.
   * @example
   * button.setParams({
   *   text: 'Submit',
   *   isEnabled: true,
   *   hasShineEffect: true,
   * });
   */
  readonly setParams: (state: Partial<S>) => E.Either<Err, void>;

  /**
   * Hides the button.
   */
  readonly hide: () => E.Either<Err, void>;

  /**
   * Shows the button.
   */
  readonly show: () => E.Either<Err, void>;

  /**
   * Enables the button.
   */
  readonly enable: () => E.Either<Err, void>;

  /**
   * Enables the button.
   */
  readonly enableShineEffect: () => E.Either<Err, void>;

  /**
   * Disables the button.
   */
  readonly disable: () => E.Either<Err, void>;

  /**
   * Enables the button.
   */
  readonly disableShineEffect: () => E.Either<Err, void>;

  /**
   * Updates the button background color.
   */
  readonly setBgColor: (value: RGB) => E.Either<Err, void>;

  /**
   * Updates the button text color.
   */
  readonly setTextColor: (value: RGB) => E.Either<Err, void>;

  /**
   * Updates the button text.
   */
  readonly setText: (value: string) => E.Either<Err, void>;

  /**
   * Shows the button loader.
   */
  readonly showLoader: () => E.Either<Err, void>;

  /**
   * Hides the button loader.
   */
  readonly hideLoader: () => E.Either<Err, void>;

  /**
   * Mounts the component restoring its state.
   */
  readonly mount: () => void;

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
  readonly onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;

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
  readonly offClick: (listener: VoidFunction, once?: boolean) => void;
  //#endregion
}
