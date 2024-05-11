import { withTimeout } from '@/timeout/withTimeout.js';
import type { ExecuteWithOptions, If, IsNever } from '@/types/index.js';

import { on } from '../events/listening/on.js';
import { postEvent as defaultPostEvent } from '../methods/postEvent.js';
import type {
  MiniAppsEventListener,
  MiniAppsEventName,
  MiniAppsEventPayload,
} from '../events/types.js';
import type { MiniAppsMethodName, MiniAppsMethodParams } from '../methods/types/index.js';

interface BasicOptions<Method extends MiniAppsMethodName, Event extends MiniAppsEventName>
  extends ExecuteWithOptions {
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
    IsNever<MiniAppsEventListener<Event>>,
    () => boolean,
    (payload: MiniAppsEventPayload<Event>) => boolean
  >;
}

/**
 * `request` method options.
 */
export type RequestOptions<Method extends MiniAppsMethodName, Event extends MiniAppsEventName> =
  & BasicOptions<Method, Event>
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
export async function request<Method extends MiniAppsMethodName, Event extends MiniAppsEventName>(
  options: RequestOptions<Method, Event>,
): Promise<MiniAppsEventPayload<Event>> {
  let resolve: (payload: MiniAppsEventPayload<Event>) => void;
  const promise = new Promise<MiniAppsEventPayload<Event>>((res) => {
    resolve = res;
  });

  const {
    method,
    event,
    capture,
    postEvent = defaultPostEvent,
    timeout,
  } = options;

  const stoppers = (Array.isArray(event) ? event : [event]).map(
    (ev) => on(ev, (payload: any) => {
      return (!capture || capture(payload)) && resolve(payload);
    }),
  );

  try {
    postEvent(method as any, (options as any).params);
    return await (timeout ? withTimeout(promise, timeout) : promise);
  } finally {
    // After promise execution was completed, don't forget to remove all the listeners.
    stoppers.forEach((stop) => stop());
  }
}
