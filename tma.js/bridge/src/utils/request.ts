import {
  BetterPromise,
  type BetterPromiseOptions,
  type TimeoutError,
  type CancelledError,
} from 'better-promises';
import { createCbCollector, type If, type IsNever } from '@tma.js/toolkit';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

import {
  postEventFp,
  type PostEventError,
  type PostEventFn,
  type PostEventFpFn,
} from '@/methods/postEvent.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';
import type { EventName, EventPayload } from '@/events/types/index.js';
import { on } from '@/events/emitter.js';

type AnyEventName = EventName | EventName[];

export type RequestError =
  | PostEventError
  | TimeoutError
  | CancelledError
  | unknown;

/**
 * @example
 * { event: 'scan_qr_closed' }
 * @example
 * {
 *   event: 'popup_closed',
 *   payload: { button_id: 'ok' }
 * }
 */
export type RequestCaptureFnEventsPayload<E extends EventName[]> =
  E extends (infer U extends EventName)[]
    ? {
      [K in U]: If<
        IsNever<EventPayload<K>>,
        { event: K },
        { event: K; payload: EventPayload<K> }
      >
    }[U]
    : never;

export type RequestCaptureEventsFn<E extends EventName[]> = (
  payload: RequestCaptureFnEventsPayload<E>,
) => boolean;

export type RequestCaptureEventFn<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  () => boolean,
  (payload: EventPayload<E>) => boolean
>;

export type RequestCaptureFn<E extends AnyEventName> = E extends EventName[]
  ? RequestCaptureEventsFn<E>
  : E extends EventName
    ? RequestCaptureEventFn<E>
    : never;

export interface RequestOptions<E extends AnyEventName> extends Omit<RequestFpOptions<E>, 'postEvent'> {
  /**
   * Custom function to call mini apps methods.
   */
  postEvent?: PostEventFn;
}

export type RequestResult<E extends AnyEventName> =
  E extends (infer U extends EventName)[]
    ? U extends infer K extends EventName
      ? If<IsNever<EventPayload<K>>, undefined, EventPayload<K>>
      : never
    : E extends EventName
      ? If<IsNever<EventPayload<E>>, undefined, EventPayload<E>>
      : never;

export interface RequestFpOptions<E extends AnyEventName> extends Pick<
  BetterPromiseOptions,
  'abortSignal' | 'timeout'
> {
  /**
   * A function that should return true if the event should be captured.
   * The first compatible request will be captured if this property is omitted.
   */
  capture?: RequestCaptureFn<E>;
  /**
   * A custom function to call mini apps methods.
   */
  postEvent?: PostEventFpFn;
}

export type RequestFn = typeof request;
export type RequestFpFn = typeof requestFp;

/**
 * Calls a method waiting for the specified event(-s) to occur.
 * @param method - method name.
 * @param eventOrEvents - tracked event or events.
 * @param options - additional options.
 */
export function requestFp<M extends MethodNameWithRequiredParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options: RequestFpOptions<E> & { params: MethodParams<M> },
): TE.TaskEither<RequestError, RequestResult<E>>;

/**
 * Calls a method waiting for the specified event(-s) to occur.
 * @param method - method name.
 * @param eventOrEvents - tracked event or events.
 * @param options - additional options.
 */
export function requestFp<M extends MethodNameWithOptionalParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestFpOptions<E> & { params?: MethodParams<M> },
): TE.TaskEither<RequestError, RequestResult<E>>;

/**
 * Calls a method waiting for the specified event(-s) to occur.
 * @param method - method name.
 * @param eventOrEvents - tracked event or events.
 * @param options - additional options.
 */
export function requestFp<M extends MethodNameWithoutParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestFpOptions<E>,
): TE.TaskEither<RequestError, RequestResult<E>>;

export function requestFp<M extends MethodName, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestFpOptions<E> & { params?: MethodParams<M> },
): TE.TaskEither<RequestError, RequestResult<E>> {
  options ||= {};
  const {
    // If no capture function was passed, we capture the first compatible event.
    capture = () => true,
    postEvent = postEventFp,
  } = options;
  const [addCleanup, cleanup] = createCbCollector();

  const promise = new BetterPromise<RequestResult<E>>(resolve => {
    // Iterate over all the tracked events and add a listener, checking if the event
    // should be captured.
    (Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents]).forEach(event => {
      // Each event listener waits for the event to occur.
      // Then, if the capture function was passed, we should check if the event should
      // be captured. If the function is omitted, we instantly capture the event.
      addCleanup(
        on(event, payload => {
          if (
            Array.isArray(eventOrEvents)
              ? (capture as RequestCaptureEventsFn<EventName[]>)({ event, payload })
              : (capture as RequestCaptureEventFn<EventName>)(payload)
          ) {
            resolve(payload as RequestResult<E>);
          }
        }),
      );
    });
  }, options)
    .finally(cleanup);

  return pipe(
    postEvent(method as any, (options as any).params),
    O.match(
      () => TE.tryCatch(() => promise, e => e),
      e => TE.left(e),
    ),
  );
}

/**
 * @see requestFp
 */
export function request<M extends MethodNameWithRequiredParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options: RequestOptions<E> & { params: MethodParams<M> },
): BetterPromise<RequestResult<E>>;

/**
 * @see requestFp
 */
export function request<M extends MethodNameWithOptionalParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestOptions<E> & { params?: MethodParams<M> },
): BetterPromise<RequestResult<E>>;

/**
 * @see requestFp
 */
export function request<M extends MethodNameWithoutParams, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestOptions<E>,
): BetterPromise<RequestResult<E>>;

export function request<M extends MethodName, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestOptions<E> & { params?: MethodParams<M> },
): BetterPromise<RequestResult<E>> {
  const { postEvent } = options || {};

  return BetterPromise.fn(() => {
    return pipe(
      // @ts-expect-error TypeScript will not be able to handle our overrides here.
      requestFp(method, eventOrEvents, {
        ...options,
        postEvent: postEvent
          ? (...args: any[]) => {
            try {
              // @ts-expect-error TypeScript will not be able to handle our overrides here.
              postEvent(...args);
              return O.none;
            } catch (e) {
              return O.some(e);
            }
          }
          : postEventFp,
      }),
      TE.match(
        error => {
          throw error;
        },
        result => result,
      ),
    )();
  }) as BetterPromise<RequestResult<E>>;
}
