import {IsNever} from '../types';

/**
 * Returns function that represents event listener.
 */
type EventListener<Params> = EventParams<Params> extends infer U
  ? IsNever<U> extends true
    ? true
    : U extends []
      ? () => void
      : U extends any[]
        ? (...args: U) => void
        : never
  : never;

/**
 * Verifies that passed generic type could be used to describe event
 * parameters.
 */
type EventParams<Params> = Params extends any[]
  ? Params
  : Params extends (...args: any[]) => any
    ? Parameters<Params>
    : IsNever<Params> extends true
      ? []
      : never;

/**
 * Returns event names.
 */
type EventName<Schema> = keyof Schema;

/**
 * Returns event names which do not require any arguments.
 */
type EmptyEventName<Schema> = {
  [E in EventName<Schema>]: EventParams<Schema[E]> extends [] ? E : never;
}[EventName<Schema>];

/**
 * Returns event names which require arguments.
 */
type NonEmptyEventName<Schema> =
  Exclude<EventName<Schema>, EmptyEventName<Schema>>;

/**
 * Represents any listener, which could be used in EventEmitter.subscribe.
 */
type AnySubscribeListener<Schema> = {
  [E in keyof Schema]: IsNever<EventParams<Schema[E]>> extends true
    ? (event: E) => void
    : (event: E, ...args: EventParams<Schema[E]>) => void;
}[keyof Schema];

export {
  EventName,
  EventParams,
  NonEmptyEventName,
  EmptyEventName,
  EventListener,
  AnySubscribeListener,
};