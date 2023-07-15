import { useComponent } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { QRScanner } from './types.js';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useComponent('qrScanner');
  useEventsTracking(qrScanner, ['isOpenedChanged']);

  return qrScanner;
}
