import { createFnOption } from '@/fn-options/createFnOption.js';
import { withVersion } from '@/fn-options/withVersion.js';
import { withPostEvent } from '@/fn-options/withPostEvent.js';

export const withVersionBasedPostEvent = createFnOption(
  () => withPostEvent(withVersion({})),
);
