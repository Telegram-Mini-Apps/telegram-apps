import { withTimeout } from '@/timeout/withTimeout.js';
import type { ExecuteWithOptions, If, IsNever } from '@/types/index.js';

import { on } from '../events/listening/on.js';
import { postEvent as defaultPostEvent } from '../methods/postEvent.js';
import type {
  MiniAppsEventName,
  MiniAppsEventPayload,
} from '../events/types.js';
import type {
  MiniAppsMethodName,
  MiniAppsMethodParams,
  MiniAppsMethodWithoutParams,
  MiniAppsMethodWithParams,
} from '../methods/types/index.js';

/**
 * Simple `request` method options.
 */
export type RequestSimpleOptions<Method extends MiniAppsMethodName> =
  Omit<RequestCompleteOptions<Method, any>, 'method' | 'event'>;

/**
 * Complete `request` method options.
 */
export type RequestCompleteOptions<
  Method extends MiniAppsMethodName,
  Event extends MiniAppsEventName,
> =
  & {
    /**
     * Mini Apps method name.
     */
    method: Method;
    /**
     * One or many tracked Mini Apps events.
     */
    event: Event | Event[];
    /**
     * Should return true in case, this event should be captured. If not specified,
     * request will be captured automatically.
     */
    capture?: If<
      IsNever<MiniAppsEventPayload<Event>>,
      () => boolean,
      (payload: MiniAppsEventPayload<Event>) => boolean
    >
  }
  & ExecuteWithOptions
  & If<IsNever<MiniAppsMethodParams<Method>>, {}, {
  /**
   * List of method parameters.
   */
  params: MiniAppsMethodParams<Method>
}>;

/**
 * Calls specified Mini Apps method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param options - method options.
 */
export function request<Method extends MiniAppsMethodWithParams, Event extends MiniAppsEventName>(
  options: RequestCompleteOptions<Method, Event>,
): Promise<MiniAppsEventPayload<Event>>;

/**
 * Calls specified Mini Apps method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method name.
 * @param eventOrEvents - tracked event or events.
 * @param options - method options.
 */
export function request<
  Method extends MiniAppsMethodWithoutParams,
  Event extends MiniAppsEventName,
>(
  method: Method,
  eventOrEvents: Event | Event[],
  options: RequestSimpleOptions<Method>,
): Promise<MiniAppsEventPayload<Event>>;

/**
 * Calls specified Mini Apps method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method name.
 * @param eventOrEvents - tracked event or events.
 * @param options - method options.
 */
export function request<Method extends MiniAppsMethodWithParams, Event extends MiniAppsEventName>(
  method: Method,
  eventOrEvents: Event | Event[],
  options?: RequestSimpleOptions<Method>,
): Promise<MiniAppsEventPayload<Event>>;

export async function request<Method extends MiniAppsMethodName, Event extends MiniAppsEventName>(
  methodOrOptions: Method | RequestCompleteOptions<Method, Event>,
  eventOrEvents?: Event | Event[],
  simpleOptions?: RequestSimpleOptions<Method>,
): Promise<MiniAppsEventPayload<Event>> {
  let resolve: (payload: MiniAppsEventPayload<Event>) => void;
  const promise = new Promise<MiniAppsEventPayload<Event>>((res) => {
    resolve = res;
  });
  const options: RequestCompleteOptions<Method, Event> = (
    eventOrEvents
      ? {
        ...simpleOptions,
        event: eventOrEvents,
        method: methodOrOptions,
      }
      : methodOrOptions
  ) as RequestCompleteOptions<Method, Event>;

  const {
    method,
    event,
    capture,
    postEvent = defaultPostEvent,
    timeout,
  } = options;

  const stoppers = (Array.isArray(event) ? event : [event]).map(
    (ev) => on(ev, (payload?) => (!capture || capture(payload)) && resolve(payload)),
  );

  try {
    postEvent(method as any, (options as any).params);
    return await (timeout ? withTimeout(promise, timeout) : promise);
  } finally {
    // After promise execution was completed, don't forget to remove all the listeners.
    stoppers.forEach((stop) => stop());
  }
}
