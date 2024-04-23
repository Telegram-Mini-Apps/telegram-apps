import { createSupportsFn } from '@/supports/createSupportsFn.js';
import type { MiniAppsMethodName } from '@/bridge/methods/types/methods.js';
import type { SupportsFn } from '@/supports/types.js';
import type { Version } from '@/version/types.js';

export class WithSupports<SupportsMethod extends string> {
  constructor(
    /**
     * Mini Apps version.
     */
    version: Version,
    /**
     * Supports method schema.
     */
    supportsSchema: Record<SupportsMethod, MiniAppsMethodName>,
  ) {
    this.supports = createSupportsFn(version, supportsSchema);
  }

  /**
   * @returns True, if specified method is supported by current component.
   */
  supports: SupportsFn<SupportsMethod>;
}
