import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve QRScanner component.
 */
export const useQRScanner = createHook('qrScanner', true);

/**
 * HOC to wrap specified component to pass QRScanner instance.
 */
export const withQRScanner = createHoc('qrScanner', useQRScanner);
