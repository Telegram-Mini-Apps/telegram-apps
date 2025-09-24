import { isTMA, on, requestFp, postEventFp, off } from '@tma.js/bridge';

import { Biometry } from '@/features/Biometry/Biometry.js';
import { isPageReload } from '@/navigation.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';

export const biometry = new Biometry({
  isPageReload,
  isTma: isTMA,
  offBiometryInfoReceived(listener) {
    off('biometry_info_received', listener);
  },
  onBiometryInfoReceived(listener) {
    return on('biometry_info_received', listener);
  },
  postEvent: postEventFp,
  request: requestFp,
  storage: createComponentSessionStorage('backButton'),
  version,
});
