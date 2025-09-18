import { computed, type Computed, type Signal, signal } from '@tma.js/signals';
import type { RGB } from '@tma.js/types';

import type { MaybeAccessor } from '@/types.js';
import { access } from '@/helpers/access.js';
import { removeUndefined } from '@/helpers/removeUndefined.js';

function shallowEqual(a: object, b: object): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  return aKeys.length !== bKeys.length
    ? false
    : aKeys.every(aKey => {
      return Object.prototype.hasOwnProperty.call(b, aKey)
        && (a as any)[aKey] === (b as any)[aKey];
    });
}

export interface BottomButtonState {
  bgColor?: RGB;
  hasShineEffect: boolean;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  isVisible: boolean;
  text: string;
  textColor?: RGB;
}

export interface BottomButtonOptions<T> {
  /**
   * Default values for different kinds of the button properties.
   */
  defaults: {
    bgColor: MaybeAccessor<RGB>;
    textColor: MaybeAccessor<RGB>;
  };
  /**
   * A function to post the button state.
   * @param state - the current button state.
   */
  post: (state: T) => void;
  /**
   * A function to save the button state somewhere.
   * @param state - the current button state.
   */
  save: (state: T) => void;
  /**
   * The initial button state.
   */
  initialState: T;
}

export class BottomButton<T extends BottomButtonState> {
  private readonly _state: Signal<T>;

  private readonly save: (state: T) => void;

  private readonly post: (state: T) => void;

  /**
   * The button background color.
   */
  readonly bgColor: Computed<RGB>;

  /**
   * True if the button has a shining effect.
   */
  readonly hasShineEffect = this.fromState('hasShineEffect');

  /**
   * True if the button is clickable.
   */
  readonly isEnabled = this.fromState('isEnabled');

  /**
   * True if the button loader is visible.
   */
  readonly isLoaderVisible = this.fromState('isLoaderVisible');

  /**
   * True if the button is visible.
   */
  readonly isVisible = this.fromState('isVisible');

  /**
   * The complete button state.
   */
  readonly state: Computed<T>;

  /**
   * The button displayed text.
   */
  readonly text = this.fromState('text');

  /**
   * The button text color.
   *
   * Note that this value is computed based on the external defaults. For
   * example, if not explicitly set, this value may be equal to one of theme
   * params colors.
   */
  readonly textColor: Computed<RGB>;

  constructor({ initialState, defaults, post, save }: BottomButtonOptions<T>) {
    const withDefault = (
      color: 'bgColor' | 'textColor',
      getDefault: MaybeAccessor<RGB>,
    ) => {
      return computed(() => {
        return this._state()[color] || access(getDefault);
      });
    };
    this._state = signal(initialState);
    this.state = computed(this._state);
    this.bgColor = withDefault('bgColor', defaults.bgColor);
    this.textColor = withDefault('textColor', defaults.textColor);
    this.post = post;
    this.save = save;
  }

  protected fromState<K extends keyof T>(key: K): Computed<T[K]> {
    return computed(() => this._state()[key]);
  }

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
  setParams(state: Partial<T>): void {
    const prev = this._state();
    const next = { ...this._state(), ...removeUndefined(state) };
    if (!shallowEqual(prev, next)) {
      this._state.set(next);
      this.save(next);
      // We should not post changes until the payload is correct.
      // Some version of Telegram will crash due to the empty value of the text.
      if (next.text) {
        this.post(next);
      }
    }
  }
}
