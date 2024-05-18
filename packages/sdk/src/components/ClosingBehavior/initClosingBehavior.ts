import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { ClosingBehavior } from './ClosingBehavior.js';

/**
 * @returns A new initialized instance of the `ClosingBehavior` class.
 * @see ClosingBehavior
 */
export const initClosingBehavior = createComponentInitFn(
  'closingBehavior',
  ({
    postEvent,
    state = { isConfirmationNeeded: false },
  }) => new ClosingBehavior(state.isConfirmationNeeded, postEvent),
);
