import { createInitFn } from '@/components/createInitFn.js';

import { ClosingBehavior } from './ClosingBehavior.js';

/**
 * @returns A new initialized instance of ClosingBehavior class.
 */
export const initClosingBehavior = createInitFn('closingBehavior', (
  { postEvent },
  { isConfirmationNeeded = false },
) => new ClosingBehavior(isConfirmationNeeded, postEvent));
