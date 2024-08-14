import type { VoidFn, IsNever, If } from '@telegram-apps/types';

type IsUndefined<T> = [T] extends [undefined] ? true : false;

type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : (B extends true ? true : false);

/**
 * Accepts type assuming, it is responsible for describing event listener
 * parameters. Covers following cases:
 * 1. If function is passed, return its arguments.
 * 2. If never or void is passed, return empty tuple.
 * 3. If array is passed return this type.
 * 4. Otherwise, return tuple with passed type.
 */
export type EventParams<Params> = Params extends any[]
  ? Params
  : Params extends (...args: any) => any
    ? Parameters<Params>
    : If<
      Or<IsNever<Params>, IsUndefined<Params>>,
      [],
      Params extends void ? [] : [Params]
    >;

/**
 * Returns function that represents event listener with specified
 * list of parameters.
 */
export type EventListener<Params> = VoidFn<EventParams<Params>>;

/**
 * Returns event names.
 */
export type EventName<Schema> = Extract<keyof Schema, string>;

/**
 * Returns event names which do not require any arguments.
 */
export type EmptyEventName<Schema> = {
  [E in EventName<Schema>]: EventParams<Schema[E]> extends [] ? E : never;
}[EventName<Schema>];

/**
 * Returns event names which require arguments.
 */
export type NonEmptyEventName<Schema> = Exclude<EventName<Schema>, EmptyEventName<Schema>>;

/**
 * Represents any listener, which could be used in EventEmitter.subscribe.
 */
export type SubscribeListener<Schema> = (
  payload: {
    [E in EventName<Schema>]: { event: E; args: EventParams<Schema[E]> };
  }[EventName<Schema>],
) => void;

/**
 * Function, which removes bound event listener.
 */
export interface RemoveEventListenerFn {
  (): void;
}
