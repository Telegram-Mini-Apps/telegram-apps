import { createTransformerGen } from '@/transformers/createTransformerGen.js';
import { number } from './number.js';
import type { TransformerGen } from '@/types.js';

export const date: TransformerGen<Date> = createTransformerGen((value) => (
  value instanceof Date ? value : new Date(number()(value) * 1000)
), 'Date');
