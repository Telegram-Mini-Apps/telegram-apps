import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve SettingsButton component.
 */
export const useSettingsButton = createHook('settingsButton', true);

/**
 * HOC to wrap specified component to pass SettingsButton instance.
 */
export const withSettingsButton = createHoc('settingsButton', useSettingsButton);
