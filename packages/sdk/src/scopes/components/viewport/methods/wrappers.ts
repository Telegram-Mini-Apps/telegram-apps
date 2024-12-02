import { createWrapBasic } from '@/scopes/toolkit/createWrapBasic.js';
import { createWrapMounted } from '@/scopes/toolkit/createWrapMounted.js';

import { isMounted } from '../signals/mounting.js';
import { COMPONENT_NAME } from '../const.js';

export const wrapBasic = createWrapBasic(COMPONENT_NAME);

export const wrapMounted = createWrapMounted(COMPONENT_NAME, isMounted);