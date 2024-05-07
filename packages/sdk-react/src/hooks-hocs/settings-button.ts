import { initSettingsButton } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the SettingsButton component instance.
 */
export const useSettingsButton: Hook<typeof initSettingsButton> = createHook(initSettingsButton);

/**
 * HOC to pass the SettingsButton component instance to the wrapped component.
 */
export const withSettingsButton: HOC<'settingsButton', typeof useSettingsButton> = createHOC('settingsButton', useSettingsButton);
