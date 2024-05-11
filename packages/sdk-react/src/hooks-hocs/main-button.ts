import { initMainButton } from '@tma.js/sdk';

import { createHOCs } from '../createHOCs.js';
import { createHooks } from '../createHooks.js';

export const [useMainButtonRaw, useMainButton] = createHooks(initMainButton);

export const [withMainButtonRaw, withMainButton] = createHOCs(useMainButtonRaw, useMainButton);
