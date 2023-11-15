import type { EventEmitter } from '@tma.js/event-emitter';

import type { StateEvents } from './types.js';

/**
 * Represents state which is observable via passed EventEmitter.
 */
export class State<S extends object> {
  constructor(private readonly state: S, private readonly ee?: EventEmitter<StateEvents<S>>) {
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

  set<K extends keyof S>(key: K, value: S[K]): void;
  set(state: Partial<S>): void;
  set(keyOrState: any, value?: any): void {
    let didChange = false;

    if (typeof keyOrState === 'string') {
      didChange = this.internalSet(keyOrState as any, value);
    } else {
      // eslint-disable-next-line
      for (const key in keyOrState) {
        if (this.internalSet(key as any, keyOrState[key])) {
          didChange = true;
        }
      }
    }

    if (didChange) {
      this.emit('changed');
    }
  }

  get<K extends keyof S>(key: K): Readonly<S[K]> {
    return this.state[key];
  }

  getState() {
    return { ...this.state };
  }
}
