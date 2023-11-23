import type { EventEmitter } from '~/event-emitter/index.js';

import type { StateEvents } from './types.js';

/**
 * Represents state which is observable via passed EventEmitter.
 */
export class State<S extends object> {
  constructor(
    private readonly state: S,
    private readonly ee?: Pick<EventEmitter<StateEvents<S>>, 'on' | 'off' | 'emit'>,
  ) {
  }

  private emit(key: string, value?: unknown) {
    if (this.ee) {
      (this.ee as any).emit(key, value);
    }
  }

  private internalSet<K extends keyof S>(key: K, value: S[K]): boolean {
    if (this.state[key] === value) {
      return false;
    }

    this.state[key] = value;
    this.emit(`${String(key)}Changed`, value);

    return true;
  }

  /**
   * Sets value by key.
   * @param key - state key.
   * @param value - value to set.
   */
  set<K extends keyof S>(key: K, value: S[K]): void;
  set(state: Partial<S>): void;
  set(keyOrState: string | Partial<S>, value?: S[keyof S]): void {
    let didChange = false;

    if (typeof keyOrState === 'string') {
      didChange = this.internalSet(keyOrState as any, value);
    } else {
      // eslint-disable-next-line
      for (const key in keyOrState) {
        if (this.internalSet(key, keyOrState[key] as any)) {
          didChange = true;
        }
      }
    }

    if (didChange) {
      this.emit('changed');
    }
  }

  /**
   * Returns value by specified key.
   * @param key - state key.
   */
  get<K extends keyof S>(key: K): Readonly<S[K]> {
    return this.state[key];
  }

  /**
   * Returns copy of current state.
   */
  clone(): S {
    return { ...this.state };
  }
}
