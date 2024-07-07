import { initSwipeBehavior } from '@telegram-apps/sdk';

import { createHOCs } from '../createHOCs.js';
import { createHooks } from '../createHooks.js';

export const [useSwipeBehaviorRaw, useSwipeBehavior] = createHooks(initSwipeBehavior);

export const [withSwipeBehaviorRaw, withSwipeBehavior] = createHOCs(
  useSwipeBehaviorRaw,
  useSwipeBehavior,
);
