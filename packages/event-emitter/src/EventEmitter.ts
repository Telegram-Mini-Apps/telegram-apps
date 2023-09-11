import type {
  AnySubscribeListener,
  EmptyEventName,
  EventListener, EventName,
  EventParams, NonEmptyEventName,
} from './types.js';

type EmitterEventListener = EventListener<any> | {
  listener: EventListener<any>;
  once: true;
};

/**
 * EventEmitter represents classic JavaScript event emitter. It allows usage
 * both known and unknown events.
 */
export class EventEmitter<Schema> {
  private readonly listeners: Record<string, EmitterEventListener[]> = {};

  private readonly subscribeListeners: AnySubscribeListener<Schema>[] = [];

  /**
   * Emits known event which has no parameters.
   * @param event - event name.
   */
  emit<E extends EmptyEventName<Schema>>(event: E): void;

  /**
   * Emits known event which has parameters.
   * @param event - event name.
   * @param args - list of event listener arguments.
   */
  emit<E extends NonEmptyEventName<Schema>>(
    event: E,
    ...args: EventParams<Schema[E]>
  ): void;

  emit(event: EventName<Schema>, ...args: any[]): void {
    this.subscribeListeners.forEach((l) => (l as any)(event, ...args));

    const listeners = this.listeners[event];
    if (listeners === undefined) {
      return;
    }

    // In this array we store all event listeners which should be unbound. We don't unbind
    // listeners right before call because "off" method will remove all listener entries
    // in listeners array.
    const toUnbind: EventListener<any>[] = [];

    listeners.forEach((l) => {
      if (typeof l === 'function') {
        l(...args);
        return;
      }

      if (l.once) {
        toUnbind.push(l.listener);
      }
      l.listener(...args);
    });

    toUnbind.forEach((l) => this.off(event, l));
  }

  /**
   * Adds event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  on<E extends EventName<Schema>>(event: E, listener: EventListener<Schema[E]>): void {
    const listeners = this.listeners[event];

    if (listeners === undefined) {
      this.listeners[event] = [listener];
    } else {
      listeners.push(listener);
    }
  }

  /**
   * Adds event listener which will be called only once.
   * @param event - event name.
   * @param listener - event listener.
   */
  once<E extends EventName<Schema>>(event: E, listener: EventListener<Schema[E]>): void {
    const listeners = this.listeners[event];
    const addedListener = { listener, once: true as const };

    if (listeners === undefined) {
      this.listeners[event] = [addedListener];
    } else {
      listeners.push(addedListener);
    }
  }

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off<E extends EventName<Schema>>(event: E, listener: EventListener<Schema[E]>): void {
    const listeners = this.listeners[event];
    if (listeners === undefined) {
      return;
    }

    for (let i = 0; i < listeners.length; i += 1) {
      const l = listeners[i];
      const currentListener = typeof l === 'function' ? l : l.listener;

      if (listener === currentListener) {
        listeners.splice(i, 1);
        i -= 1;
      }
    }
  }

  /**
   * Subscribes to any events appearing.
   * @param listener - events listener.
   */
  subscribe(listener: AnySubscribeListener<Schema>) {
    this.subscribeListeners.push(listener);
  }

  /**
   * Removes listener from global listeners.
   * @param listener - events listener.
   */
  unsubscribe(listener: AnySubscribeListener<Schema>) {
    const idx = this.subscribeListeners.indexOf(listener);
    if (idx >= 0) {
      this.subscribeListeners.splice(idx, 1);
    }
  }
}
