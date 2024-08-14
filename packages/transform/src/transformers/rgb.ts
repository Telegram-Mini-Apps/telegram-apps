import type { RGB } from '@telegram-apps/types';

import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { toRGB } from '@/toRGB.js';
import type { TransformerGen } from '@/types.js';

import { string } from './string.js';

export const rgb: TransformerGen<RGB> = createTransformerGen((value) => toRGB(string()(value)), 'rgb');
