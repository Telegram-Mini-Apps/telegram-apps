import {useComponent} from '../../provider';
import {useEventsTracking} from '../hooks';
import {QRScanner} from './types';

/**
 * Returns QRScanner component instance.
 */
export function useQRScanner(): QRScanner {
  const qrScanner = useComponent('qrScanner');
  useEventsTracking(qrScanner, ['isOpenedChanged']);

  return qrScanner;
}
