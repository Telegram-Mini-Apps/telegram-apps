import type { RGB } from '@telegram-apps/types';

import { toRGB } from '@/toRGB.js';
import type { TransformerGen } from '@/types.js';

import { createTransformerGen } from './createTransformerGen.js';

import { string } from './string.js';

export const rgb: TransformerGen<RGB> = createTransformerGen('rgb', v => toRGB(string()(v)));
