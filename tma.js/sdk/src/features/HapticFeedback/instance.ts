import { isTMAFp, postEventFp } from '@tma.js/bridge';

import { HapticFeedback } from '@/features/HapticFeedback/HapticFeedback.js';
import { version } from '@/globals/version.js';

export const hapticFeedback = new HapticFeedback({
  postEvent: postEventFp,
  isTma: isTMAFp,
  version,
});
