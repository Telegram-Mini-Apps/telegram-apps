import type { QRScannerEvents, QRScannerState } from './types.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { request } from '../../bridge/request.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { State } from '../../state/State.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import type { SupportsFunc } from '../../supports/types.js';
import type { Version } from '../../version/types.js';

type Emitter = EventEmitter<QRScannerEvents>;

/**
 * Provides QR scanner functionality.
 */
export class QRScanner {
  private readonly ee = new EventEmitter<QRScannerEvents>();

  private readonly state: State<QRScannerState>;

  constructor(
    version: Version,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isOpened: false }, this.ee);
    this.supports = createSupportsFunc(version, {
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
    this.state.set('isOpened', value);
  }

  /**
   * Returns true in case, QR scanner is currently opened.
   */
  get isOpened(): boolean {
    return this.state.get('isOpened');
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
        { text },
        ['qr_text_received', 'scan_qr_popup_closed'],
        { postEvent: this.postEvent },
      );

      return typeof result === 'object' && typeof result.data === 'string' ? result.data : null;
    } finally {
      this.isOpened = false;
    }
  }

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = this.ee.off.bind(this.ee);

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'open' | 'close'>;
}
