import type { EventEmitter } from '~/event-emitter/index.js';
import type { StringKeys } from '~/types/index.js';

import type { StateEvents } from './types.js';

/**
 * Represents state which is observable via passed EventEmitter.
 */
export class State<S extends object> {
  constructor(
    private readonly state: S,
    private readonly ee: Pick<EventEmitter<StateEvents<S>>, 'on' | 'off' | 'emit'>,
  ) {
  }

  private internalSet<K extends StringKeys<S>>(key: K, value: S[K]): boolean {
    if (this.state[key] === value) {
      return false;
    }

    this.state[key] = value;
    (this.ee as any).emit(`change:${key}`, value);

    return true;
  }

  /**
   * Returns copy of current state.
   */
  clone(): S {
    return { ...this.state };
  }

  /**
   * Sets value by key.
   * @param key - state key.
   * @param value - value to set.
   */
  set<K extends StringKeys<S>>(key: K, value: S[K]): void;
  set(state: Partial<S>): void;
  set(keyOrState: StringKeys<S> | Partial<S>, value?: S[keyof S]): void {
    let didChange = false;

    if (typeof keyOrState === 'string') {
      didChange = this.internalSet(keyOrState, value as any);
    } else {
      // eslint-disable-next-line
      for (const key in keyOrState) {
        if (this.internalSet(key, keyOrState[key] as any)) {
          didChange = true;
        }
      }
    }

    if (didChange) {
      (this.ee as any).emit('change');
    }
  }

  /**
   * Returns value by specified key.
   * @param key - state key.
   */
  get<K extends StringKeys<S>>(key: K): S[K] {
    return this.state[key];
  }
}
