import { WithStateUtils } from '@/classes/WithStateUtils.js';
import { createSupportsFn } from '@/supports/createSupportsFn.js';
import type { MiniAppsMethodName } from '@/bridge/methods/types/methods.js';
import type { SupportsFn } from '@/supports/types.js';
import type { Version } from '@/version/types.js';

export class WithSupportsAndStateUtils<StateShape extends object, SupportsMethod extends string>
extends WithStateUtils<StateShape> {
  constructor(
    /**
     * Initial state.
     */
    stateShape: StateShape,
    /**
     * Mini Apps version.
     */
    version: Version,
    /**
     * Supports method schema.
     */
    supportsSchema: Record<SupportsMethod, MiniAppsMethodName>,
  ) {
    super(stateShape);
    this.supports = createSupportsFn(version, supportsSchema);
  }

  /**
   * @returns True, if specified method is supported by the current component.
   */
  supports: SupportsFn<SupportsMethod>;
}
