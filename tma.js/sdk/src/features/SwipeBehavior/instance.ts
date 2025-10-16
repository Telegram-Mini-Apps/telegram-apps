import { pipe } from 'fp-ts/function';

import { SwipeBehavior, type SwipeBehaviorState } from '@/features/SwipeBehavior/SwipeBehavior.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';

export const swipeBehavior = new SwipeBehavior(pipe(
  sharedFeatureOptions(),
  withVersionBasedPostEvent,
  withStateRestore<SwipeBehaviorState>('swipeBehavior'),
));
