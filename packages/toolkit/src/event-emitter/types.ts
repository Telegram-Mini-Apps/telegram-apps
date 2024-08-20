import type { If, Or } from '@/types/logical.js';
import type { IsNever, IsUndefined } from '@/types/predicates.js';
import type { VoidFn } from '@/types/misc.js';

/**
 * Accepts a type assuming, it is responsible for describing event listener parameters.
 * Covers the following cases:
 * 1. If a function is passed, return its arguments.
 * 2. If never or void is passed, return empty tuple.
 * 3. If an array is passed, return this type.
 * 4. Otherwise, return a tuple with the passed type.
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
 * Returns a function that represents event listener with the specified list of parameters.
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
export type RemoveEventListenerFn = () => void;
