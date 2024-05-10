import { initPopup } from '@tma.js/sdk';

import { createHOCs } from '../createHOCs.js';
import { createHooks } from '../createHooks.js';

export const [usePopupRaw, usePopup] = createHooks(initPopup);

export const [withPopupRaw, withPopup] = createHOCs(usePopupRaw, usePopup);
