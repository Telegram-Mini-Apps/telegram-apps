import { isRecord } from '~/misc/index.js';
import { withTimeout } from '~/timeout/index.js';
import type { And, ExecuteWithOptions, If, IsNever } from '~/types/index.js';

import {
  type MiniAppsEventHasParams,
  type MiniAppsEventName,
  type MiniAppsEventParams,
  on,
} from './events/index.js';
import {
  type MiniAppsEmptyMethodName,
  type MiniAppsMethodAcceptParams,
  type MiniAppsMethodName,
  type MiniAppsMethodParams,
  type MiniAppsNonEmptyMethodName,
  postEvent as defaultPostEvent,
} from './methods/index.js';

/**
 * Names of methods, which require passing "req_id" parameter.
 */
type MethodWithRequestId = {
  [M in MiniAppsMethodName]: If<
    And<
      MiniAppsMethodAcceptParams<M>,
      MiniAppsMethodParams<M> extends { req_id: string } ? true : false
    >,
    M,
    never
  >;
}[MiniAppsMethodName];

/**
 * Names of events, which contain "req_id" parameter.
 */
type EventWithRequestId = {
  [E in MiniAppsEventName]: If<
    And<MiniAppsEventHasParams<E>, MiniAppsEventParams<E> extends {
      req_id: string
    } ? true : false>,
    E,
    never
  >;
}[MiniAppsEventName];

export interface RequestOptions extends ExecuteWithOptions {
}

export interface RequestOptionsAdvanced<EventPayload> extends RequestOptions {
  /**
   * Should return true in case, this event should be captured. If not specified,
   * request is not skipping captured events.
   */
  capture?: If<IsNever<EventPayload>, () => boolean, (payload: EventPayload) => boolean>;
}

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, event with specified in method request identifier
 * was captured.
 * @param method - method to execute.
 * @param params - method parameters.
 * @param event - event or events to listen.
 * @param options - additional execution options.
 */
export function request<M extends MethodWithRequestId, E extends EventWithRequestId>(
  method: M,
  params: MiniAppsMethodParams<M>,
  event: E | E[],
  options?: RequestOptions,
): Promise<MiniAppsEventParams<E>>;

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method to execute.
 * @param event - event or events to listen.
 * @param options - additional execution options.
 */
export function request<M extends MiniAppsEmptyMethodName, E extends MiniAppsEventName>(
  method: M,
  event: E | E[],
  options?: RequestOptionsAdvanced<MiniAppsEventParams<E>>,
): Promise<MiniAppsEventParams<E>>;

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method to execute
 * @param params - method parameters.
 * @param event - event or events to listen
 * @param options - additional execution options.
 */
export function request<M extends MiniAppsNonEmptyMethodName, E extends MiniAppsEventName>(
  method: M,
  params: MiniAppsMethodParams<M>,
  event: E | E[],
  options?: RequestOptionsAdvanced<MiniAppsEventParams<E>>,
): Promise<MiniAppsEventParams<E>>;

export function request(
  method: MiniAppsMethodName,
  eventOrParams: MiniAppsEventName | MiniAppsEventName[] | MiniAppsEventParams<any>,
  eventOrOptions?:
    | MiniAppsEventName
    | MiniAppsEventName[]
    | RequestOptions
    | RequestOptionsAdvanced<any>,
  options?: RequestOptions | RequestOptionsAdvanced<any>,
): Promise<any> {
  let executionOptions: RequestOptions | RequestOptionsAdvanced<any> | undefined;
  let methodParams: MiniAppsEventParams<any> | undefined;
  let events: MiniAppsEventName[];
  let requestId: string | undefined;

  if (typeof eventOrParams === 'string' || Array.isArray(eventOrParams)) {
    // Override: [method, event, options?]
    events = Array.isArray(eventOrParams) ? eventOrParams : [eventOrParams] as MiniAppsEventName[];
    executionOptions = eventOrOptions as (RequestOptionsAdvanced<any> | undefined);
  } else {
    // Override: [method, params, event, options?]
    methodParams = eventOrParams as MiniAppsEventParams<any>;
    events = Array.isArray(eventOrOptions)
      ? eventOrOptions
      : [eventOrOptions] as MiniAppsEventName[];
    executionOptions = options;
  }

  // In case, method parameters were passed, and they contained request identifier, we should store
  // it and wait for the event with this identifier to occur.
  if (isRecord(methodParams) && typeof methodParams.req_id === 'string') {
    requestId = methodParams.req_id;
  }

  const { postEvent = defaultPostEvent, timeout } = executionOptions || {};
  const capture = executionOptions && 'capture' in executionOptions
    ? executionOptions.capture
    : null;

  const execute = () => {
    return new Promise((res, rej) => {
      // Iterate over each event and create event listener.
      const stoppers = events.map((ev) => on(ev, (data?) => {
        // If request identifier was specified, we are waiting for event with the same value
        // to occur.
        if (requestId && (!isRecord(data) || data.req_id !== requestId)) {
          return;
        }

        if (typeof capture === 'function' && !capture(data)) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        stopListening();
        res(data);
      }));

      // Function which removes all event listeners.
      const stopListening = () => stoppers.forEach((stop) => stop());

      try {
        // We are wrapping this call in try catch, because it can throw errors in case,
        // compatibility check was enabled. We want an error to be captured by promise, not by
        // another one external try catch.
        postEvent(method as any, methodParams);
      } catch (e) {
        stopListening();
        rej(e);
      }
    });
  };

  return typeof timeout === 'number' ? withTimeout(execute, timeout) : execute();
}
