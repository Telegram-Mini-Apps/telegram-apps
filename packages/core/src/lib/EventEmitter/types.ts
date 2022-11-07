import {AnyFunc, IsNever} from '../../types';

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
  : Params extends AnyFunc
    ? Parameters<Params>
    : IsNever<Params> extends true
      ? []
      : never;

/**
 * Returns event names.
 */
export type EventNames<Schema> = keyof Schema;

/**
 * Returns event names which do not require any arguments.
 */
export type EmptyEventNames<Schema> = {
  [E in EventNames<Schema>]: EventParams<Schema[E]> extends [] ? E : never;
}[EventNames<Schema>];

/**
 * Returns event names which require arguments.
 */
export type NonEmptyEventNames<Schema> =
  Exclude<EventNames<Schema>, EmptyEventNames<Schema>>;

/**
 * Represents listener which is listening to any events.
 */
export type GlobalListener = (event: string, ...args: any[]) => void;

/**
 * Represents any listener, which could be used in EventEmitter.
 */
export type AnyListener = EventListener<any[]>;