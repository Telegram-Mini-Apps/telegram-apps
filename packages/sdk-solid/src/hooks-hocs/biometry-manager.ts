import { initBiometryManager } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the BiometryManager component instance.
 */
export const useBiometryManager: Hook<typeof initBiometryManager> = createHook(initBiometryManager);

/**
 * HOC to pass the BiometryManager component instance to the wrapped component.
 */
export const withBiometryManager: HOC<'biometryManager', typeof useBiometryManager> = createHOC('biometryManager', useBiometryManager);
