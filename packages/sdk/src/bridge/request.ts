import { withTimeout } from '@/timeout/withTimeout.js';
import type { ExecuteWithOptions, If, IsNever } from '@/types/index.js';

import { on } from './events/listening.js';
import { postEvent as defaultPostEvent } from './methods/postEvent.js';
import { createCleanup } from '@/misc/createCleanup.js';
import type * as MiniApps from './types.js';

/**
 * Returns all possible payloads for the specified events array.
 */
export type RequestEventsPayloads<E extends MiniApps.EventName[]> =
  E extends (infer U extends MiniApps.EventName)[]
    ? MiniApps.EventPayload<U>
    : never;

export type RequestCaptureEventsFn<E extends MiniApps.EventName[]> =
  E extends (infer U extends MiniApps.EventName)[]
    ? (payload: {
      [K in U]: If<
        IsNever<MiniApps.EventPayload<K>>,
        { event: K },
        { event: K; payload: MiniApps.EventPayload<K> }
      >
    }[U]) => boolean
    : never;

export type RequestCaptureEventFn<E extends MiniApps.EventName> = If<
  IsNever<MiniApps.EventPayload<E>>,
  () => boolean,
  (payload: MiniApps.EventPayload<E>) => boolean
>;

/**
 * `request` method options.
 * @see request
 */
export type RequestOptions<M extends MiniApps.MethodName, E, C> = {
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
  & If<IsNever<MiniApps.MethodParams<M>>, {}, {
  /**
   * List of method parameters.
   */
  params: MiniApps.MethodParams<M>
}>;

type AnyRequestResult =
  | MiniApps.EventPayload<MiniApps.EventName>
  | RequestEventsPayloads<MiniApps.EventName[]>;

/**
 * Calls specified Mini Apps method and captures specified event.
 * @param options - method options.
 * @returns Promise which will be resolved with data of the captured event.
 */
export async function request<M extends MiniApps.MethodName, E extends MiniApps.EventName>(
  options: RequestOptions<M, E, RequestCaptureEventFn<E>>,
): Promise<MiniApps.EventPayload<E>>;

/**
 * Calls specified Mini Apps method and captures one of the specified events.
 * @param options - method options.
 * @returns Promise which will be resolved with data of the first captured event.
 */
export async function request<M extends MiniApps.MethodName, E extends MiniApps.EventName[]>(
  options: RequestOptions<M, E, RequestCaptureEventsFn<E>>,
): Promise<RequestEventsPayloads<E>>;

export async function request<M extends MiniApps.MethodName>(
  options:
    | RequestOptions<M, MiniApps.EventName, RequestCaptureEventFn<MiniApps.EventName>>
    | RequestOptions<M, MiniApps.EventName[], RequestCaptureEventsFn<MiniApps.EventName[]>>,
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
            ? (capture as RequestCaptureEventsFn<MiniApps.EventName[]>)({
              event: ev,
              payload: payload as any,
            })
            : (capture as RequestCaptureEventFn<MiniApps.EventName>)(payload)
        )) {
          resolve(payload);
        }
      });
    }),
  );

  try {
    (options.postEvent || defaultPostEvent)(options.method as any, (options as any).params);
    return await (timeout ? withTimeout(promise, timeout) : promise);
  } finally {
    // After promise execution was completed, don't forget to remove all the listeners.
    cleanup();
  }
}
