import { type PostEvent, postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { createRequestIdGenerator } from '@/request-id/createRequestIdGenerator.js';
import { signal } from '@/signals/signal/signal.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import type { Version } from '@/version/types.js';

export interface ConfigureOptions {
  /**
   * A maximum supported Mini Apps version.
   * @default Being extracted using the `retrieveLaunchParams` function.
   * @see retrieveLaunchParams
   */
  version?: Version;
  /**
   * Custom postEvent function.
   *
   * Passing the "strict" value creates a function, which always checks if specified call supported
   * by currently supported Mini Apps version. If the method is unsupported, an error will be
   * thrown.
   *
   * Passing the "non-strict" value creates a postEvent function not throwing any errors, but
   * warning about a missing method support.
   *
   * @default 'strict'
   * @see createPostEvent
   */
  postEvent?: PostEvent | 'strict' | 'non-strict';
}

/**
 * Signal with a request identifier generator. Usually, you don't need to set this value manually.
 */
export const createRequestId = signal(createRequestIdGenerator());

/**
 * Configures package global dependencies.
 * @param options - configuration additional options.
 */
export function configure(options?: ConfigureOptions): void {
  options ||= {};
  const { postEvent: optionsPostEvent } = options;
  const v = options.version || retrieveLaunchParams().version;
  version.set(v);
  // FIXME: non-strict
  postEvent.set(typeof optionsPostEvent === 'function' ? optionsPostEvent : createPostEvent(v));
}

/**
 * Signal with a currently used postEvent function across the package.
 */
export const postEvent = signal<PostEvent>(defaultPostEvent);

/**
 * Signal with a currently supported maximum Mini Apps version. This value is usually set via
 */
export const version = signal<Version>('0.0');
