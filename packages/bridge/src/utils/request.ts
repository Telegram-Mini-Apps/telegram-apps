import {
  BetterPromise,
  createCbCollector,
  type If,
  type IsNever,
} from '@telegram-apps/toolkit';

import { on } from '@/events/listening.js';
import { postEvent } from '@/methods/postEvent.js';
import type {
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodParams,
} from '@/methods/types/index.js';
import type { EventName, EventPayload } from '@/events/types.js';
import type { ExecuteWithOptions } from '@/types.js';

type AnyEventName = EventName | EventName[];

export type RequestCaptureFnEventsPayload<E extends EventName[]> = E extends (infer U extends EventName)[]
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
) => boolean

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

export interface RequestBasicOptions<E extends AnyEventName> extends ExecuteWithOptions {
  /**
   * Should return true if this event should be captured.
   * The first compatible request will be captured if this property is omitted.
   */
  capture?: RequestCaptureFn<E>;
}

export type RequestResult<E extends AnyEventName> =
  E extends (infer U extends EventName)[]
    ? EventPayload<U>
    : E extends EventName
      ? EventPayload<E>
      : never;

export interface RequestFn {
  /**
   * Performs a request waiting for specified events to occur.
   *
   * This overriding is used for methods, requiring parameters.
   * @param method - method name.
   * @param eventOrEvents - tracked event or events.
   * @param options - additional options.
   */<M extends MethodNameWithRequiredParams, E extends AnyEventName>(
    method: M,
    eventOrEvents: E,
    options: RequestBasicOptions<E> & { params: MethodParams<M> },
  ): BetterPromise<RequestResult<E>>;

  /**
   * Performs a request waiting for specified events to occur.
   *
   * This overriding is used for methods with optional parameters.
   * @param method - method name.
   * @param eventOrEvents - tracked event or events.
   * @param options - additional options.
   */<M extends MethodNameWithOptionalParams, E extends AnyEventName>(
    method: M,
    eventOrEvents: E,
    options?: RequestBasicOptions<E> & { params?: MethodParams<M> },
  ): BetterPromise<RequestResult<E>>;

  /**
   * Performs a request waiting for specified events to occur.
   *
   * This overriding is used for methods without parameters.
   * @param method - method name.
   * @param eventOrEvents - tracked event or events.
   * @param options - additional options.
   */<M extends MethodNameWithoutParams, E extends AnyEventName>(
    method: M,
    eventOrEvents: E,
    options?: RequestBasicOptions<E>,
  ): BetterPromise<RequestResult<E>>;
}

export const request: RequestFn = <M extends MethodName, E extends AnyEventName>(
  method: M,
  eventOrEvents: E,
  options?: RequestBasicOptions<E> & { params?: MethodParams<M> },
): BetterPromise<RequestResult<E>> => {
  options ||= {};
  const promise = BetterPromise.withOptions<RequestResult<E>>(options);

  const { capture } = options || {};
  const [, cleanup] = createCbCollector(
    // We need to iterate over all tracked events and create their event listeners.
    (
      (Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents]) as EventName[]
    ).map(event => {
      // Each event listener waits for the event to occur.
      // Then, if the capture function was passed, we should check if the event should be captured.
      // If the function is omitted, we instantly capture the event.
      return on(event, payload => {
        if (!capture || (
          Array.isArray(eventOrEvents)
            ? (capture as RequestCaptureEventsFn<EventName[]>)({
              event,
              payload,
            } as RequestCaptureFnEventsPayload<EventName[]>)
            : (capture as RequestCaptureEventFn<EventName>)(payload)
        )) {
          promise.resolve(payload as RequestResult<E>);
        }
      });
    }),
  );

  return BetterPromise
    .resolve()
    .then(() => {
      (options.postEvent || postEvent)(method as any, (options as any).params);
      return promise;
    })
    .finally(cleanup);
};
