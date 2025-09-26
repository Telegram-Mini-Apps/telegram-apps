import { pipe } from 'fp-ts/function';

import {
  ClosingBehavior,
  type ClosingBehaviorState,
} from '@/features/ClosingBehavior/ClosingBehavior.js';
import { sharedFeatureOptions, withPostEvent, withStateRestore } from '@/features/mixins.js';

/**
 * @internal
 */
export function instantiateClosingBehavior() {
  return new ClosingBehavior(pipe(
    sharedFeatureOptions(),
    withStateRestore<ClosingBehaviorState>('closingBehavior'),
    withPostEvent,
  ));
}

export const closingBehavior = instantiateClosingBehavior();
