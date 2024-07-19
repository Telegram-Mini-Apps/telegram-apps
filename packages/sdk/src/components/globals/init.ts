import { type PostEvent, postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { set as setVersion } from '@/components/globals/version.js';
import { set as setPostEvent } from '@/components/globals/postEvent.js';
import type { Version } from '@/version/types.js';

export interface InitOptions {
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
 * Initializes global dependencies.
 * @param options - additional options.
 */
export function init(options: InitOptions = {}): void {
  const lp = retrieveLaunchParams();
  setVersion(options.version || lp.version);
  setPostEvent(options.postEvent || defaultPostEvent);
}
