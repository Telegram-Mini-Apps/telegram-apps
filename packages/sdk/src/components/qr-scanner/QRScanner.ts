import { request } from '@/bridge/request.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { Version } from '@/version/types.js';

import type { QRScannerState } from './types.js';

// TODO: Usage

/**
 * @see API: https://docs.telegram-mini-apps.com/packages/tma-js-sdk/components/qr-scanner
 */
export class QRScanner extends WithStateAndSupports<QRScannerState, 'close' | 'open'> {
  constructor(isOpened: boolean, version: Version, private readonly postEvent: PostEvent) {
    super({ isOpened }, version, {
      close: 'web_app_close_scan_qr_popup',
      open: 'web_app_open_scan_qr_popup',
    });
  }

  /**
   * Closes scanner.
   */
  close(): void {
    this.postEvent('web_app_close_scan_qr_popup');
    this.isOpened = false;
  }

  private set isOpened(value) {
    this.set('isOpened', value);
  }

  /**
   * Returns true in case, QR scanner is currently opened.
   */
  get isOpened(): boolean {
    return this.get('isOpened');
  }

  /**
   * Opens scanner with specified title shown to user. Method returns promise
   * with scanned QR content in case, it was scanned. It will contain null in
   * case, scanner was closed.
   * @param text - title to display.
   */
  async open(text?: string): Promise<string | null> {
    if (this.isOpened) {
      throw new Error('QR scanner is already opened.');
    }

    this.isOpened = true;

    try {
      const result = await request(
        'web_app_open_scan_qr_popup',
        ['qr_text_received', 'scan_qr_popup_closed'],
        {
          postEvent: this.postEvent,
          params: { text },
        },
      ) || {};

      return result.data || null;
    } finally {
      this.isOpened = false;
    }
  }
}
