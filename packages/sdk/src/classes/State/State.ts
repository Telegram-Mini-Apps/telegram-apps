import { EventEmitter } from '@/events/event-emitter/EventEmitter.js';
import type { StateEvents } from '@/classes/State/types.js';
import type { StringKeys } from '@/types/utils.js';

type Emitter<State extends object> = EventEmitter<StateEvents<State>>;

export class State<State extends object> {
  private readonly ee: Emitter<State> = new EventEmitter();

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
  clone(): State {
    return { ...this.state };
  }

  /**
   * Sets value by key.
   * @param key - state key.
   * @param value - value to set.
   */
  set<K extends StringKeys<State>>(key: K, value: State[K]): void;
  /**
   * Sets several values simultaneously.
   * @param state - partial state.
   */
  set(state: Partial<State>): void;
  set(keyOrState: StringKeys<State> | Partial<State>, keyValue?: State[keyof State]): void {
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
  get<K extends StringKeys<State>>(key: K): State[K] {
    return this.state[key];
  }

  /**
   * Adds new event listener.
   */
  on: Emitter<State>['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter<State>['off'] = this.ee.off.bind(this.ee);
}
