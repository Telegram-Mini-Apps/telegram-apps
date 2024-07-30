import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';

import { parse } from './ThemeParams.static.js';
import { state as _state, isMounted as _isMounted } from './themeParams.private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/theming
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/theme-params
 */

/**
 * Mounts the component restoring its state and adding special event listeners, actualizing
 * the component state.
 */
function mount(): void {
  if (!_isMounted()) {
    _state.set(isPageReload() && getStorageValue('themeParams') || retrieveLaunchParams().themeParams);
    on('theme_changed', onThemeChanged);
    _isMounted.set(true);
  }
}

/**
 * Actualizes the theme parameters whenever an according event was received.
 * @param e - event data.
 */
const onThemeChanged: MiniAppsEventListener<'theme_changed'> = (e) => {
  const value = parse(e.theme_params);
  _state.set(value);
  setStorageValue('themeParams', value);
};

/**
 * Unmounts the component removing all bound event listeners.
 */
function unmount(): void {
  if (_isMounted()) {
    off('theme_changed', onThemeChanged);
    _isMounted.set(false);
  }
}

export { mount, unmount };
export * from './themeParams.computed.js';
