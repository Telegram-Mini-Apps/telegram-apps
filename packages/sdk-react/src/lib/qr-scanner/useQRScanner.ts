import {QRScanner} from 'twa-sdk';

import {useComponent} from '../../sdk';
import {useEventsTracking} from '../../hooks';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useComponent('qrScanner');
  useEventsTracking(qrScanner, ['openChanged']);

  return qrScanner;
}
