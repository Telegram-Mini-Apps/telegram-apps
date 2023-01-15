import {IsNever} from '../types';

/**
 * Returns function that represents event listener.
 */
export type EventListener<Params> = EventParams<Params> extends infer U
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
export type EventParams<Params> = Params extends any[]
  ? Params
  : Params extends (...args: any[]) => any
    ? Parameters<Params>
    : IsNever<Params> extends true
      ? []
      : never;

/**
 * Returns event names.
 */
export type EventName<Schema> = keyof Schema;

/**
 * Returns event names which do not require any arguments.
 */
export type EmptyEventName<Schema> = {
  [E in EventName<Schema>]: EventParams<Schema[E]> extends [] ? E : never;
}[EventName<Schema>];

/**
 * Returns event names which require arguments.
 */
export type NonEmptyEventName<Schema> =
  Exclude<EventName<Schema>, EmptyEventName<Schema>>;

/**
 * Represents any listener, which could be used in EventEmitter.subscribe.
 */
export type AnySubscribeListener<Schema> = {
  [E in keyof Schema]: IsNever<EventParams<Schema[E]>> extends true
    ? (event: E) => void
    : (event: E, ...args: EventParams<Schema[E]>) => void;
}[keyof Schema];