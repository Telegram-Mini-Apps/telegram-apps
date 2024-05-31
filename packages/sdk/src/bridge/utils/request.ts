import { withTimeout } from '@/timeout/withTimeout.js';
import type { ExecuteWithOptions, If, IsNever } from '@/types/index.js';

import { on } from '../events/listening/on.js';
import { postEvent as defaultPostEvent } from '../methods/postEvent.js';
import type { MiniAppsEventName, MiniAppsEventPayload } from '../events/types.js';
import type { MiniAppsMethodName, MiniAppsMethodParams } from '../methods/types/index.js';
import { createCleanup } from '@/misc/createCleanup.js';

/**
 * `request` method `capture` option.
 * @see request
 */
export type RequestCapture<T extends MiniAppsEventName | MiniAppsEventName[]> =
  T extends (infer U extends MiniAppsEventName)[]
    ? If<
      IsNever<MiniAppsEventPayload<U>>,
      () => boolean,
      (payload: {
        [K in U]: If<
          IsNever<MiniAppsEventPayload<K>>,
          { event: K; },
          { event: K; payload: MiniAppsEventPayload<K> }
        >
      }[U]) => boolean
    >
    : T extends MiniAppsEventName
      ? If<
        IsNever<MiniAppsEventPayload<T>>,
        () => boolean,
        (payload: MiniAppsEventPayload<T>) => boolean
      >
      : never;

/**
 * `request` method options.
 * @see request
 */
export type RequestOptions<
  Method extends MiniAppsMethodName,
  Event extends MiniAppsEventName | MiniAppsEventName[]
> = {
    /**
     * Mini Apps method name.
     */
    method: Method;
    /**
     * Tracked Mini Apps events.
     */
    event: Event;
    /**
     * Should return true in case, this event should be captured. If not specified,
     * request will be captured automatically.
     */
    capture?: RequestCapture<Event>;
  }
  & ExecuteWithOptions
  & If<IsNever<MiniAppsMethodParams<Method>>, {}, {
  /**
   * List of method parameters.
   */
  params: MiniAppsMethodParams<Method>
}>;

export type RequestResult<Event extends MiniAppsEventName | MiniAppsEventName[]> =
  Event extends (infer T extends MiniAppsEventName)[]
    ? MiniAppsEventPayload<T>
    : Event extends MiniAppsEventName
      ? MiniAppsEventPayload<Event>
      : never;

/**
 * Calls specified Mini Apps method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param options - method options.
 */
export async function request<
  Method extends MiniAppsMethodName,
  Event extends MiniAppsEventName | MiniAppsEventName[]
>(
  options: RequestOptions<Method, Event>,
): Promise<RequestResult<Event>> {
  let resolve: (payload: RequestResult<Event>) => void;
  const promise = new Promise<RequestResult<Event>>((res) => {
    resolve = res;
  });

  const { event, capture, timeout } = options;
  const [, cleanup] = createCleanup(
    ...(Array.isArray(event) ? event : [event]).map(
      (ev) => on(ev, (payload: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return (!capture || capture(payload)) && resolve(payload);
      }),
    )
  );

  try {
    (options.postEvent || defaultPostEvent)(options.method as any, (options as any).params);
    return await (timeout ? withTimeout(promise, timeout) : promise);
  } finally {
    // After promise execution was completed, don't forget to remove all the listeners.
    cleanup();
  }
}
