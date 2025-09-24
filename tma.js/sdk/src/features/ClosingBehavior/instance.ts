import { isTMAFp, postEventFp } from '@tma.js/bridge';

import { ClosingBehavior } from '@/features/ClosingBehavior/ClosingBehavior.js';
import { isPageReload } from '@/navigation.js';
import { createComponentSessionStorage } from '@/component-storage.js';

export const closingBehavior = new ClosingBehavior({
  isPageReload,
  isTma: isTMAFp,
  postEvent: postEventFp,
  storage: createComponentSessionStorage('closingBehavior'),
});
