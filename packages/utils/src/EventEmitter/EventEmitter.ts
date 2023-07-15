import type {
  AnySubscribeListener,
  EmptyEventName,
  EventListener, EventName,
  EventParams, NonEmptyEventName,
} from './types.js';

/**
 * EventEmitter represents classic JavaScript event emitter. It allows usage
 * both known and unknown events.
 */
export class EventEmitter<Schema> {
  private listeners: Record<string, EventListener<any[]>[]> = {};

  private subscribeListeners: AnySubscribeListener<Schema>[] = [];

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

  emit(event: string, ...args: any[]): void {
    // Emit global listeners.
    this.subscribeListeners.forEach((l) => (l as any)(event, ...args));

    // Emit event specific listeners.
    const listeners = this.listeners[event];
    if (listeners === undefined) {
      return;
    }
    listeners.forEach((l) => l(...args));
  }

  /**
   * Adds new known event to be listened.
   * @param event - event name.
   * @param listener - event listener.
   */
  on<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
  ): void;

  on(event: string, listener: (...args: any[]) => any): void {
    const listeners = this.listeners[event];

    if (listeners === undefined) {
      this.listeners[event] = [listener];
    } else {
      listeners.push(listener);
    }
  }

  /**
   * Removes listener of known event.
   * @param event - event name.
   * @param listener - event listener.
   */
  off<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
  ): void;

  off(event: string, listener: (...args: any[]) => any): void {
    const listeners = this.listeners[event];
    if (listeners === undefined) {
      return;
    }

    const idx = listeners.indexOf(listener);
    if (idx >= 0) {
      listeners.splice(idx, 1);
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
