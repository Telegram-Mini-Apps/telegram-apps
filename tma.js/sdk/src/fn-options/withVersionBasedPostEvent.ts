import { createFnOption } from '@/fn-options/createFnOption.js';
import { type WithVersion, withVersion } from '@/fn-options/withVersion.js';
import { type WithPostEvent, withPostEvent } from '@/fn-options/withPostEvent.js';

export interface WithVersionBasedPostEvent extends WithPostEvent, WithVersion {
}

export const withVersionBasedPostEvent = createFnOption(
  () => withPostEvent(withVersion({})),
);
