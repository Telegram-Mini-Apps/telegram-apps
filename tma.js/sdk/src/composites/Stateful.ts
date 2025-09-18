import { type Computed, computed, type Signal, signal } from '@tma.js/signals';

import { removeUndefined } from '@/helpers/removeUndefined.js';

export interface StatefulOptions<S> {
  /**
   * The initial state.
   */
  initialState: S;
  /**
   * A function to call whenever the state changes.
   * @param state - updated state.
   */
  onChange: (state: S) => void;
}

export class Stateful<S extends object> {
  constructor({ initialState, onChange }: StatefulOptions<S>) {
    this._state = signal(initialState, {
      // Sufficient shallow equal.
      equals(a, b): boolean {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        return aKeys.length !== bKeys.length
          ? false
          : aKeys.every(aKey => {
            return Object.prototype.hasOwnProperty.call(b, aKey)
              && (a as any)[aKey] === (b as any)[aKey];
          });
      },
    });
    this.state = computed(this._state);
    this.state.sub(onChange);
  }

  protected readonly _state: Signal<S>;

  /**
   * The current state.
   */
  readonly state: Computed<S>;

  /**
   * Creates a computed signal based on the state.
   * @param key - a state key to use as a source.
   */
  computedFromState<K extends keyof S>(key: K): Computed<S[K]> {
    return computed(() => this._state()[key]);
  }

  /**
   * Updates the state.
   * @param state - updates to apply.
   */
  setState(state: Partial<S>): void {
    this._state.set({ ...this._state(), ...removeUndefined(state) });
  }
}
