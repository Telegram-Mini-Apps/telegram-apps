import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { postEvent, version } from '@/components/globals.js';
import { createPostEvent } from '@/bridge/methods/createPostEvent.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { Version } from '@/version/types.js';

export interface ConfigureOptions {
  /**
   * Mini Apps version.
   * @default Being extracted using the `retrieveLaunchParams` function.
   * @see retrieveLaunchParams
   */
  version?: Version;
  /**
   * Custom postEvent function.
   * Passing the "strict" value creates a function, which always checks if specified call supported
   * by currently supported Mini Apps version.
   * @default 'strict'
   */
  postEvent?: PostEvent | 'strict';
}

/**
 * Configures package global dependencies.
 * @param options - additional options.
 */
export function configure(options: ConfigureOptions = {}): void {
  const { postEvent: optionsPostEvent } = options;
  const v = options.version || retrieveLaunchParams().version;
  version.set(v);
  postEvent.set(typeof optionsPostEvent === 'function' ? optionsPostEvent : createPostEvent(v));
}
