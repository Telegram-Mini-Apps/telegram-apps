import {
  AnyListener, EmptyEventNames,
  EventListener, EventNames,
  EventParams, GlobalListener, NonEmptyEventNames,
} from './types';
import {AnyFunc} from '../../types';

/**
 * EventEmitter represents classic JavaScript event emitter. It allows usage
 * both known and unknown events.
 */
export class EventEmitter<Schema> {
  /**
   * List of currently bound events listeners.
   * @private
   */
  private listeners: Record<string, AnyListener[]> = {};

  /**
   * List of currently bound global event listeners.
   * @private
   */
  private globalListeners: GlobalListener[] = [];

  /**
   * Emits known event which has no parameters.
   * @param event - event name.
   */
  emit<E extends EmptyEventNames<Schema>>(event: E): void;

  /**
   * Emits known event which has parameters.
   *
   * @param event - event name.
   * @param args - list of event listener arguments.
   */
  emit<E extends NonEmptyEventNames<Schema>>(
    event: E,
    ...args: EventParams<Schema[E]>
  ): void;

  emit(event: string, ...args: any[]): void {
    // Emit global listeners.
    this.globalListeners.forEach(l => l(event, ...args));

    // Emit event specific listeners.
    const listeners = this.listeners[event];
    if (listeners === undefined) {
      return;
    }
    listeners.forEach(l => l(...args));
  }

  /**
   * Emits unknown event. This function is recognized dangerous and should be
   * used carefully as long as this function ignores event typings.
   *
   * @param event - event name.
   * @param args - list of event listener arguments.
   */
  emitUnsafe(event: string, ...args: any[]): void {
    this.emit(event as any, ...args as EventParams<Schema[any]>);
  }

  /**
   * Adds new known event to be listened.
   *
   * @param event - event name.
   * @param listener - event listener.
   */
  on<E extends EventNames<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>,
  ): void;

  on(event: string, listener: AnyFunc): void {
    const listeners = this.listeners[event];

    if (listeners === undefined) {
      this.listeners[event] = [listener];
    } else {
      listeners.push(listener);
    }
  }

  /**
   * Removes listener of known event.
   *
   * @param event - event name.
   * @param listener - event listener.
   */
  off<E extends EventNames<Schema>>(
    event: E,
    listener: EventListener<Schema[E]>
  ): void;

  off(event: string, listener: AnyFunc): void {
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
  subscribe(listener: GlobalListener) {
    this.globalListeners.push(listener);
  }

  /**
   * Removes listener from global listeners.
   * @param listener - events listener.
   */
  unsubscribe(listener: GlobalListener) {
    const idx = this.globalListeners.indexOf(listener);
    if (idx >= 0) {
      this.globalListeners.splice(idx, 1);
    }
  }
}
