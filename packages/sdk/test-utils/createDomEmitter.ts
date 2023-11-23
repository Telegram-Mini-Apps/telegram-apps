export interface DomEmitter {
  addEventListener(event: string, cb: (event: Event) => void): void;

  dispatchEvent(event: Event): void;
}

/**
 * Removes simple emitter, which could be used in tests.
 */
export function createDomEmitter(): DomEmitter {
  const listeners: Record<string, ((...args: any) => any)[]> = {};

  return {
    addEventListener(event, cb): void {
      if (listeners[event] === undefined) {
        listeners[event] = [];
      }
      listeners[event].push(cb);
    },
    dispatchEvent(event): void {
      const cbs = listeners[event.type] || [];
      cbs.forEach((cb) => cb(event));
    },
  };
}
