import { Bridge, supports } from '@twa.js/bridge';
import type { Version } from '@twa.js/utils';

import type { BridgeLike } from '../types';
import { MethodUnsupportedError } from './MethodUnsupportedError';

/**
 * Represents wrapper around Bridge which provides some extra functionality.
 */
export class BridgeScoped implements BridgeLike {
  constructor(
    private readonly bridge: Bridge,
    private readonly version: Version,
  ) {
  }

  postEvent: BridgeLike['postEvent'] = (method: any, params?: any) => {
    if (!supports(method, this.version)) {
      throw new MethodUnsupportedError(method, this.version);
    }
    return this.bridge.postEvent(method, params);
  };

  on = this.bridge.on.bind(this.bridge);

  off = this.bridge.off.bind(this.bridge);
}
