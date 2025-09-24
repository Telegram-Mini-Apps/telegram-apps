import { on, off, postEventFp, isTMA } from '@tma.js/bridge';

import { SettingsButton } from '@/features/SettingsButton/SettingsButton.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';
import { isPageReload } from '@/navigation.js';

export const settingsButton = new SettingsButton({
  isPageReload,
  isTma: isTMA,
  offClick(listener, once) {
    off('settings_button_pressed', listener, once);
  },
  onClick(listener, once) {
    return on('settings_button_pressed', listener, once);
  },
  postEvent: postEventFp,
  storage: createComponentSessionStorage('settingsButton'),
  version,
});
