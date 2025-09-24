import { isTMAFp, postEventFp, requestFp } from '@tma.js/bridge';

import { LocationManager } from '@/features/LocationManager/LocationManager.js';
import { version } from '@/globals/version.js';
import { isPageReload } from '@/navigation.js';
import { createComponentSessionStorage } from '@/component-storage.js';

export const locationManager = new LocationManager({
  isPageReload,
  isTma: isTMAFp,
  postEvent: postEventFp,
  request: requestFp,
  storage: createComponentSessionStorage('locationManager'),
  version,
});
