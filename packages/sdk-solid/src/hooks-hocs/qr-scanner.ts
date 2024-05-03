import { initQRScanner } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the QRScanner component instance.
 */
export const useQRScanner: Hook<typeof initQRScanner> = createHook(initQRScanner);

/**
 * HOC to pass the QRScanner component instance to the wrapped component.
 */
export const withQRScanner: HOC<'qrScanner', typeof useQRScanner> = createHOC('qrScanner', useQRScanner);
