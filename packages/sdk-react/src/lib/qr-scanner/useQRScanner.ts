import {QRScanner} from '@twa.js/sdk';

import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useComponent('qrScanner');
  useEventsTracking(qrScanner, ['isOpenedChanged']);

  return qrScanner;
}
