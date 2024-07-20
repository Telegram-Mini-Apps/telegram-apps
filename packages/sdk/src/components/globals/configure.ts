import { type PostEvent, postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { set as setVersion } from '@/components/globals/version.js';
import { set as setPostEvent } from '@/components/globals/postEvent.js';
import type { Version } from '@/version/types.js';

export interface ConfigureOptions {
  /**
   * Mini Apps version.
   */
  version?: Version;
  /**
   * Your own postEvent function.
   */
  postEvent?: PostEvent;
}

/**
 * Configures global dependencies.
 * @param options - additional options.
 */
export function configure(options: ConfigureOptions = {}): void {
  const lp = retrieveLaunchParams();
  setVersion(options.version || lp.version);
  setPostEvent(options.postEvent || defaultPostEvent);
}
