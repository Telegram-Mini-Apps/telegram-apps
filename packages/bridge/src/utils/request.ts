import type { If, IsNever } from '@telegram-apps/types';

import { on } from '@/events/listening.js';
import { withTimeout } from '@/timeout/withTimeout.js';
import { postEvent as defaultPostEvent } from '@/methods/postEvent.js';
import { createCleanup } from '@/utils/createCleanup.js';
import type { MethodName, MethodParams } from '@/methods/types/index.js';
import type { EventName, EventPayload } from '@/events/types.js';
import type { ExecuteWithOptions } from '@/types.js';

/**
 * Returns all possible payloads for the specified events array.
 */
export type RequestEventsPayloads<E extends EventName[]> =
  E extends (infer U extends EventName)[]
    ? EventPayload<U>
    : never;

export type RequestCaptureEventsFn<E extends EventName[]> =
  E extends (infer U extends EventName)[]
    ? (payload: {
      [K in U]: If<
        IsNever<EventPayload<K>>,
        { event: K },
        { event: K; payload: EventPayload<K> }
      >
    }[U]) => boolean
    : never;

export type RequestCaptureEventFn<E extends EventName> = If<
  IsNever<EventPayload<E>>,
  () => boolean,
  (payload: EventPayload<E>) => boolean
>;

/**
 * `request` method options.
 * @see request
 */
export type RequestOptions<M extends MethodName, E, C> = {
    /**
     * Mini Apps method name.
     */
    method: M;
    /**
     * Tracked Mini Apps events.
     */
    event: E;
    /**
     * Should return true if this event should be captured.
     * A request will be captured if this property is omitted.
     */
    capture?: C;
  }
  & ExecuteWithOptions
  & If<IsNever<MethodParams<M>>, {}, {
  /**
   * List of method parameters.
   */
  params: MethodParams<M>
}>;

type AnyRequestResult = EventPayload<EventName> | RequestEventsPayloads<EventName[]>;

/**
 * Calls specified Mini Apps method and captures specified event.
 * @param options - method options.
 * @returns Promise which will be resolved with data of the captured event.
 */
export async function request<M extends MethodName, E extends EventName>(
  options: RequestOptions<M, E, RequestCaptureEventFn<E>>,
): Promise<EventPayload<E>>;

/**
 * Calls specified Mini Apps method and captures one of the specified events.
 * @param options - method options.
 * @returns Promise which will be resolved with data of the first captured event.
 */
export async function request<M extends MethodName, E extends EventName[]>(
  options: RequestOptions<M, E, RequestCaptureEventsFn<E>>,
): Promise<RequestEventsPayloads<E>>;

export async function request<M extends MethodName>(
  options:
    | RequestOptions<M, EventName, RequestCaptureEventFn<EventName>>
    | RequestOptions<M, EventName[], RequestCaptureEventsFn<EventName[]>>,
): Promise<AnyRequestResult> {
  let resolve: (payload: AnyRequestResult) => void;
  const promise = new Promise<AnyRequestResult>(res => resolve = res);

  const { event, capture, timeout } = options;
  const [, cleanup] = createCleanup(
    // We need to iterate over all tracked events, and create their event listeners.
    (Array.isArray(event) ? event : [event]).map((ev) => {
      // Each event listener waits for the event to occur.
      // Then, if the capture function was passed, we should check if the event should be captured.
      // If the function is omitted, we instantly capture the event.
      return on(ev, (payload) => {
        if (!capture || (
          Array.isArray(event)
            ? (capture as RequestCaptureEventsFn<EventName[]>)({
              event: ev,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              payload: payload as any,
            })
            : (capture as RequestCaptureEventFn<EventName>)(payload)
        )) {
          resolve(payload);
        }
      });
    }),
  );

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (options.postEvent || defaultPostEvent)(options.method as any, (options as any).params);
    return await (timeout ? withTimeout(promise, timeout) : promise);
  } finally {
    // After promise execution was completed, don't forget to remove all the listeners.
    cleanup();
  }
}
