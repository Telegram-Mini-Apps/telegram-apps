import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type { StringKeys } from '@/types/utils.js';

import type { StateEvents } from './types.js';

export class WithState<State extends object> {
  private readonly ee = new EventEmitter<StateEvents<State>>();

  constructor(
    /**
     * Initial state.
     */
    private readonly state: State,
  ) {
  }

  /**
   * Clones current state and returns its copy.
   */
  protected clone(): State {
    return { ...this.state };
  }

  /**
   * Sets value by key.
   * @param key - state key.
   * @param value - value to set.
   */
  protected set<K extends StringKeys<State>>(key: K, value: State[K]): void;
  protected set(state: Partial<State>): void;
  protected set(
    keyOrState: StringKeys<State> | Partial<State>,
    keyValue?: State[keyof State],
  ): void {
    const didChange = Object
      .entries(typeof keyOrState === 'string' ? { [keyOrState]: keyValue } : keyOrState)
      .reduce((acc, [key, value]) => {
        // If value is the same or missing at all, we skip it.
        if (this.state[key as keyof State] === value || value === undefined) {
          return acc;
        }

        // Otherwise set new value and emit change event.
        this.state[key as keyof State] = value;
        (this.ee as any).emit(`change:${key}`, value);

        return true;
      }, false);

    if (didChange) {
      (this.ee as any).emit('change', this.state);
    }
  }

  /**
   * Returns value by specified key.
   * @param key - state key.
   */
  protected get<K extends StringKeys<State>>(key: K): State[K] {
    return this.state[key];
  }

  /**
   * Adds new event listener.
   */
  on: EventEmitter<StateEvents<State>>['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: EventEmitter<StateEvents<State>>['off'] = this.ee.off.bind(this.ee);
}
