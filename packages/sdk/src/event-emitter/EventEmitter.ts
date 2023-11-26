import type {
  AnySubscribeListener,
  EmptyEventName,
  EventListener, EventName,
  EventParams, NonEmptyEventName, RemoveEventListener,
} from './types.js';

type AddedEventListener = [listener: EventListener<any>, once: boolean];

/**
 * Opinionated event emitter implementation.
 */
export class EventEmitter<Schema> {
  private readonly listeners: Map<string, AddedEventListener[]> = new Map();

  private readonly subscribeListeners: AnySubscribeListener<Schema>[] = [];

  /**
   * Adds specified event listener.
   * @param event - event name.
   * @param listener - event listener.
   * @param once - should listener called only once.
   */
  private addListener<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
    once: boolean,
  ): RemoveEventListener {
    let listeners = this.listeners.get(event);
    if (!listeners) {
      listeners = [];
      this.listeners.set(event, listeners);
    }

    listeners.push([listener, once]);

    return () => this.off(event, listener);
  }

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

    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    listeners.forEach(([listener, once], idx) => {
      listener(...args);
      if (once) {
        listeners.splice(idx, 1);
      }
    });
  }

  /**
   * Adds event listener.
   * @param event - event name.
   * @param listener - event listener.
   * @returns Function to remove event listener.
   */
  on<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
  ): RemoveEventListener {
    return this.addListener(event, listener, false);
  }

  /**
   * Adds event listener following the logic, described in `on` method, but calls specified
   * listener only once, removing it after.
   * @param event - event name.
   * @param listener - event listener.
   * @returns Function to remove event listener.
   * @see on
   */
  once<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
  ): RemoveEventListener {
    return this.addListener(event, listener, true);
  }

  /**
   * Removes event listener. In case, specified listener was bound several times, it removes
   * only a single one.
   * @param event - event name.
   * @param listener - event listener.
   */
  off<E extends EventName<Schema>>(event: E, listener: EventListener<Schema[E]>): void {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    for (let i = 0; i < listeners.length; i += 1) {
      if (listener === listeners[i][0]) {
        listeners.splice(i, 1);
        return;
      }
    }
  }

  /**
   * Adds event listener to all events.
   * @param listener - events listener.
   * @returns Function to remove event listener.
   * @see on
   * @see once
   */
  subscribe(listener: AnySubscribeListener<Schema>): RemoveEventListener {
    this.subscribeListeners.push(listener);
    return () => this.unsubscribe(listener);
  }

  /**
   * Removes global event listener. In case, specified listener was bound several times, it removes
   * only a single one.
   * @param listener - events listener.
   * @returns Function to remove event listener.
   */
  unsubscribe(listener: AnySubscribeListener<Schema>): void {
    for (let i = 0; i < this.subscribeListeners.length; i += 1) {
      if (this.subscribeListeners[i] === listener) {
        this.subscribeListeners.splice(i, 1);
        return;
      }
    }
  }
}
