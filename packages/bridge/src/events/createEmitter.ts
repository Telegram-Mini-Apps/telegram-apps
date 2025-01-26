import mitt, {
  type Emitter,
  type EventHandlerMap,
  type EventType,
  type Handler,
} from 'mitt';
import type { If, IsNever, IsUndefined, Or } from '@telegram-apps/toolkit';

export type WildcardHandler<E> = Handler<{
  [K in keyof E]: [K, If<Or<IsNever<E[K]>, IsUndefined<E[K]>>, void, E[K]>]
}[keyof E]>;

export interface OnFn<E> {
  /**
   * Adds a new listener for the specified event.
   * @param type - event name.
   * @param handler - event listener.
   * @param once - should listener be called only once.
   * @returns Function to remove bound event listener.
   */<K extends keyof E>(type: K, handler: Handler<E[K]>, once?: boolean): VoidFunction;
  /**
   * Adds a listener for all events.
   * @param type - event name.
   * @param handler - event listener.
   * @param once - should listener be called only once.
   * @returns Function to remove bound event listener.
   */
  (type: '*', handler: WildcardHandler<E>, once?: boolean): VoidFunction;
}

export interface OffFn<E> {
  /**
   * Removes a listener for the specified event.
   * @param type - event to listen.
   * @param handler - event listener to remove.
   * @param once - had this listener to be called only once.
   */<K extends keyof E>(type: K, handler: Handler<E[K]>, once?: boolean): void;
  /**
   * Removes a listener for all events.
   * @param type - event to stop listening.
   * @param handler - event listener to remove.
   * @param once - had this listener to be called only once.
   */
  (type: '*', handler: WildcardHandler<E>, once?: boolean): void;
}

export interface EmitFn<E> {
  <K extends keyof E>(type: K, event: E[K]): void;
  <K extends keyof E>(type: undefined extends E[K] ? K : never): void;
}

/**
 * Creates a new enhanced event emitter.
 * @param onFirst - will be called when the first event was added.
 * @param onEmpty - will be called when emitter's listeners' map was emptied.
 */
export function createEmitter<E extends object>(
  onFirst: VoidFunction,
  onEmpty: VoidFunction,
): [
  on: OnFn<E>,
  off: OffFn<E>,
  emit: EmitFn<E>,
  clear: VoidFunction
] {
  type EventMap = Map<
    (...args: any) => void,
    [handler: (...args: any) => void, once: boolean][]
  >;

  const emitter = (mitt as any as {
    <E extends Record<EventType, unknown>>(all?: EventHandlerMap<E>): Emitter<E>;
  })<E & Record<string | symbol, unknown>>();
  const map = new Map<keyof E | '*', EventMap>();

  const off: OffFn<E> = (event: keyof E | '*', handler: (...args: any) => void, once?: boolean) => {
    once ||= false;

    const eventMap: EventMap = map.get(event) || new Map();
    map.set(event, eventMap);

    const handlers = eventMap.get(handler) || [];
    eventMap.set(handler, handlers);

    const index = handlers.findIndex(item => item[1] === once);
    if (index >= 0) {
      // Remove the related handler.
      emitter.off(event, handlers[index][0]);

      // Remove the handler from the cache array.
      handlers.splice(index, 1);

      // If after removal, there are no handlers left, we should remove the entry from the cache.
      !handlers.length && eventMap.delete(handler);
      if (!eventMap.size) {
        map.delete(event);
        !map.size && onEmpty();
      }
    }
  };

  return [
    function on(event: keyof E | '*', handler: (...args: any[]) => any, once?: boolean) {
      !map.size && onFirst();

      function cleanup() {
        off(event as any, handler, once);
      }

      function fn(...args: any[]) {
        once && cleanup();
        if (event === '*') {
          handler(args);
        } else {
          handler(...args);
        }
      }

      emitter.on(event, fn);

      // Add this handler to the cache, so we could remove it using the passed listener.
      const eventMap = map.get(event) || new Map();
      map.set(event, eventMap);

      const handlers = eventMap.get(handler) || [];
      eventMap.set(handler, handlers);
      handlers.push([fn, once || false]);

      return cleanup;
    },
    off,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    emitter.emit,
    function offAll() {
      const prevSize = emitter.all.size;
      emitter.all.clear();
      map.clear();
      prevSize && onEmpty();
    },
  ];
}
