import { isTMAFp, postEventFp } from '@tma.js/bridge';

import { SwipeBehavior } from '@/features/SwipeBehavior/SwipeBehavior.js';
import { isPageReload } from '@/navigation.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';

export const swipeBehavior = new SwipeBehavior({
  isPageReload,
  isTma: isTMAFp,
  postEvent: postEventFp,
  storage: createComponentSessionStorage('swipeBehavior'),
  version,
});
