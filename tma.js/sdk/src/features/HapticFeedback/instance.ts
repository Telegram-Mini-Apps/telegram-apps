import { pipe } from 'fp-ts/function';

import { HapticFeedback } from '@/features/HapticFeedback/HapticFeedback.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';

export const hapticFeedback = new HapticFeedback(pipe(
  sharedFeatureOptions(),
  withVersionBasedPostEvent,
));
