import {BridgeEventListener} from '@twa.js/bridge';
import {EventEmitter, Version} from '@twa.js/utils';

import {QRScannerEventsMap} from './events';
import {createSupportsFunc, SupportsFunc} from '../../utils';
import {BridgeLike} from '../../types';

/**
 * Provides QR scanner functionality.
 */
export class QRScanner {
  private _isOpened = false;
  private readonly ee = new EventEmitter<QRScannerEventsMap>();

  constructor(private readonly bridge: BridgeLike, version: Version) {
    this.supports = createSupportsFunc(version, {
      close: 'web_app_close_scan_qr_popup',
      open: 'web_app_open_scan_qr_popup',
    });
  }

  /**
   * Closes scanner.
   */
  close(): void {
    this.bridge.postEvent('web_app_close_scan_qr_popup');
    this.isOpened = false;
  }

  set isOpened(value) {
    if (this._isOpened === value) {
      return;
    }
    this._isOpened = value;
    this.ee.emit('openChanged', value);
  }

  /**
   * Returns true in case, QR scanner is currently opened.
   */
  get isOpened(): boolean {
    return this._isOpened;
  }

  /**
   * Opens scanner with specified title shown to user. Method returns promise
   * with scanned QR content in case, it was scanned. It will contain null in
   * case, scanner was closed.
   * @param text - title to display.
   */
  open(text?: string): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('QR scanner is already opened.');
    }
    // Try to call bridge method.
    this.bridge.postEvent('web_app_open_scan_qr_popup', {text});

    // Update local state.
    this.isOpened = true;

    return new Promise<string | null>(res => {
      // Define listeners which will catch result of QR scanner action.
      const closeListener: BridgeEventListener<'scan_qr_popup_closed'> = () => {
        res(null);
        unbind();
      };
      const scanListener: BridgeEventListener<'qr_text_received'> = ({data = null}) => {
        res(data);
        unbind();
      };

      // Define function which will unbind bound listeners.
      const unbind = () => {
        this.bridge.off('scan_qr_popup_closed', closeListener);
        this.bridge.off('qr_text_received', scanListener);
      };

      // Add bridge listeners.
      this.bridge.on('qr_text_received', scanListener);
      this.bridge.on('scan_qr_popup_closed', closeListener);
    });
  }

  on = this.ee.on.bind(this.ee);

  off = this.ee.off.bind(this.ee);

  /**
   * Returns true in case, specified method is supported by current component
   * including Web Apps platform version.
   */
  supports: SupportsFunc<'close' | 'open'>;
}
