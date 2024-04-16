import type { MiniAppsMethodName } from '@/bridge/methods/types/methods.js';
import { WithState } from '@/classes/with-state/WithState.js';
import { createSupportsFn } from '@/supports/createSupportsFn.js';
import type { SupportsFn } from '@/supports/types.js';
import type { Version } from '@/version/types.js';

export class WithStateAndSupports<State extends object, SupportsMethod extends string>
  extends WithState<State> {
  constructor(
    /**
     * Initial state.
     */
    state: State,
    /**
     * Mini Apps version.
     */
    version: Version,
    /**
     * Supports method schema.
     */
    supportsSchema: Record<SupportsMethod, MiniAppsMethodName>,
  ) {
    super(state);
    this.supports = createSupportsFn(version, supportsSchema);
  }

  /**
   * @returns True, if specified method is supported by current component.
   */
  supports: SupportsFn<SupportsMethod>;
}
