import { useUnit } from '../../provider/index.js';
import { useEventsTracking } from '../hooks.js';
import type { QRScanner } from './types.js';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useUnit('qrScanner');
  useEventsTracking(qrScanner, ['isOpenedChanged']);

  return qrScanner;
}
