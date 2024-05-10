import { initInitData } from '@tma.js/sdk';

import { createHooks } from '../createHooks.js';
import { createHOCs } from '../createHOCs.js';

export const [useInitDataRaw, useInitData] = createHooks(initInitData);

export const [withInitDataRaw, withInitData] = createHOCs(useInitDataRaw, useInitData);
