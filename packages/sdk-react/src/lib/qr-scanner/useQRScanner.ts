import { useComponent } from '../../provider';
import { useEventsTracking } from '../hooks';
import type { QRScanner } from './types';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useComponent('qrScanner');
  useEventsTracking(qrScanner, ['isOpenedChanged']);

  return qrScanner;
}
