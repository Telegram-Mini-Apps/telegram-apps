import { EventEmitter, type Version } from '@twa.js/utils';
import { on, postEvent as bridgePostEvent, type PostEvent } from '@twa.js/bridge';

import { WithSupports } from '../../lib/index.js';

import type { QRScannerEvents } from './events.js';

/**
 * Provides QR scanner functionality.
 */
export class QRScanner extends WithSupports<'open' | 'close'> {
  readonly #ee = new EventEmitter<QRScannerEvents>();

  readonly #postEvent: PostEvent;

  #isOpened = false;

  constructor(version: Version, postEvent: PostEvent = bridgePostEvent) {
    super(version, {
      close: 'web_app_close_scan_qr_popup',
      open: 'web_app_open_scan_qr_popup',
    });
    this.#postEvent = postEvent;
  }

  /**
   * Closes scanner.
   */
  close(): void {
    this.#postEvent('web_app_close_scan_qr_popup');
    this.isOpened = false;
  }

  set isOpened(value) {
    if (this.#isOpened === value) {
      return;
    }

    this.#isOpened = value;
    this.#ee.emit('isOpenedChanged', value);
  }

  /**
   * Returns true in case, QR scanner is currently opened.
   */
  get isOpened(): boolean {
    return this.#isOpened;
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
    this.#postEvent('web_app_open_scan_qr_popup', { text });

    // Update local state.
    this.isOpened = true;

    return new Promise<string | null>((res) => {
      const offScanned = on('qr_text_received', ({ data = null }) => {
        res(data);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unbind();
      });

      const offClosed = on('scan_qr_popup_closed', () => {
        res(null);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        unbind();
      });

      // Define function which will unbind bound listeners.
      const unbind = () => {
        offClosed();
        offScanned();
      };
    });
  }

  on = this.#ee.on.bind(this.#ee);

  off = this.#ee.off.bind(this.#ee);
}
