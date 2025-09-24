import { on, off, postEventFp, isTMA } from '@tma.js/bridge';

import { BackButton } from '@/features/BackButton/BackButton.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';
import { isPageReload } from '@/navigation.js';

export const backButton = new BackButton({
  isPageReload,
  isTma: isTMA,
  offClick(listener, once) {
    off('back_button_pressed', listener, once);
  },
  onClick(listener, once) {
    return on('back_button_pressed', listener, once);
  },
  postEvent: postEventFp,
  storage: createComponentSessionStorage('backButton'),
  version,
});
