import type {
  EmptyEventName,
  EventListener,
  EventName,
  EventParams,
  NonEmptyEventName,
  RemoveEventListenerFn,
  SubscribeListener,
} from './types.js';

export class EventEmitter<Schema> {
  private readonly listeners: Map<
    string,
    [listener: EventListener<any>, once?: boolean][]
  > = new Map();

  private listenersCount = 0;

  private subscribeListeners: SubscribeListener<Schema>[] = [];

  /**
   * Removes all event listeners.
   */
  clear() {
    this.listeners.clear();
    this.subscribeListeners = [];
  }

  /**
   * Returns count of bound listeners.
   */
  get count(): number {
    return this.listenersCount + this.subscribeListeners.length;
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
  emit<E extends NonEmptyEventName<Schema>>(event: E, ...args: EventParams<Schema[E]>): void;

  emit(event: EventName<Schema>, ...args: any[]): void {
    this.subscribeListeners.forEach((l) => l({
      event,
      args: args as EventParams<Schema[EventName<Schema>]>,
    }));

    const listeners = this.listeners.get(event) || [];

    listeners.forEach(([listener, once]) => {
       
      listener(...args);
      if (once) {
        this.off(event, listener);
      }
    });
  }

  /**
   * Adds new event listener.
   * @param event - event name.
   * @param listener - event listener.
   * @param once - should listener be called only once.
   * @returns Function to remove bound event listener.
   */
  on<E extends EventName<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
    once?: boolean,
  ): RemoveEventListenerFn {
    let listeners = this.listeners.get(event);
    if (!listeners) {
      this.listeners.set(event, listeners = []);
    }

    listeners.push([listener, once]);
    this.listenersCount += 1;

    return () => this.off(event, listener);
  }

  /**
   * Removes event listener. In case, specified listener was bound several times, it removes
   * only a single one.
   * @param event - event name.
   * @param listener - event listener.
   */
  off<E extends EventName<Schema>>(event: E, listener: EventListener<Schema[E]>): void {
    const listeners = this.listeners.get(event) || [];
    for (let i = 0; i < listeners.length; i += 1) {
      if (listener === listeners[i][0]) {
        listeners.splice(i, 1);
        this.listenersCount -= 1;
        return;
      }
    }
  }

  /**
   * Adds a new event listener for all events.
   * @param listener - event listener.
   * @returns Function to remove event listener.
   */
  subscribe(listener: SubscribeListener<Schema>): RemoveEventListenerFn {
    this.subscribeListeners.push(listener);
    return () => this.unsubscribe(listener);
  }

  /**
   * Removes global event listener. In case, specified listener was bound several times, it removes
   * only a single one.
   * @param listener - event listener.
   */
  unsubscribe(listener: SubscribeListener<Schema>): void {
    for (let i = 0; i < this.subscribeListeners.length; i += 1) {
      if (this.subscribeListeners[i] === listener) {
        this.subscribeListeners.splice(i, 1);
        return;
      }
    }
  }
}
