import { on } from '@/bridge/events/listening/on.js';
import { off } from '@/bridge/events/listening/off.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';

import { parse } from './static.js';
import * as _ from './private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/theming
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/theme-params
 */

const STORAGE_KEY = 'themeParams';
const THEME_CHANGED_EVENT = 'theme_changed';

/**
 * Mounts the component restoring its state and adding special event listeners, actualizing
 * the component state.
 */
function mount(): void {
  if (!_.isMounted()) {
    _.state.set(isPageReload() && getStorageValue(STORAGE_KEY) || retrieveLaunchParams().themeParams);
    on(THEME_CHANGED_EVENT, onThemeChanged);
    _.isMounted.set(true);
  }
}

/**
 * Actualizes the theme parameters whenever an according event was received.
 * @param e - event data.
 */
const onThemeChanged: MiniAppsEventListener<'theme_changed'> = (e) => {
  const value = parse(e.theme_params);
  _.state.set(value);
  setStorageValue(STORAGE_KEY, value);
};

/**
 * Unmounts the component removing all bound event listeners.
 */
function unmount(): void {
  if (_.isMounted()) {
    off(THEME_CHANGED_EVENT, onThemeChanged);
    _.isMounted.set(false);
  }
}

export {
  mount,
  unmount,
};
export {
  accentTextColor,
  backgroundColor,
  buttonColor,
  buttonTextColor,
  destructiveTextColor,
  headerBackgroundColor,
  hintColor,
  isMounted,
  isDark,
  linkColor,
  state,
  secondaryBackgroundColor,
  sectionBackgroundColor,
  sectionSeparatorColor,
  sectionHeaderTextColor,
  subtitleTextColor,
  textColor,
} from './computed.js';
