import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { request } from '@/bridge/request.js';
import { createError } from '@/errors/createError.js';
import { postEvent } from '@/scopes/globals/globals.js';
import { on } from '@/bridge/events/listening.js';
import { createCleanup } from '@/misc/createCleanup.js';
import { ERR_SCANNER_OPENED } from '@/errors/errors.js';

import * as _ from './private.js';

// TODO: Links?

const CLOSE_METHOD = 'web_app_close_scan_qr_popup';
const OPEN_METHOD = 'web_app_open_scan_qr_popup';
const CLOSED_EVENT = 'scan_qr_popup_closed';
const SCANNED_EVENT = 'qr_text_received';

/**
 * Closes the scanner.
 */
export const close: WithIsSupported<() => void> = decorateWithIsSupported(() => {
  _.isOpened.set(false);
  postEvent()(CLOSE_METHOD);
}, CLOSE_METHOD);

type OpenFn = WithIsSupported<{
  /**
   * Opens the scanner.
   *
   * Whenever a user scans a QR, the passed `capture` function is being called with the QR
   * content. It should return true if this QR must be captured and promise resolved.
   * @param options - method options.
   * @returns A captured QR content or null, if the scanner was closed.
   */
  (options: {
    /**
     * Title to be displayed in the scanner.
     */
    text?: string;
    /**
     * Function, which should return true if a scanned QR should be captured and promise resolved.
     * @param qr - scanned QR content.
     */
    capture(this: void, qr: string): boolean;
  }): Promise<string | null>;
  /**
   * Opens the scanner in stream mode.
   *
   * Whenever a user scans a QR, the passed `onCaptured` function will be called.
   * @param options - method options.
   */
  (options: {
    /**
     * Title to be displayed in the scanner.
     */
    text?: string;
    /**
     * Function which will be called in case, some QR code was scanned.
     * @param qr - scanned QR content.
     */
    onCaptured(this: void, qr: string): void;
  }): void;
}>;

const open: OpenFn = decorateWithIsSupported((options) => {
  if (_.isOpened()) {
    throw createError(ERR_SCANNER_OPENED);
  }
  _.isOpened.set(true);

  const { text } = options;

  // Capture single QR mode.
  if ('capture' in options) {
    const { capture } = options;

    return request({
      method: OPEN_METHOD,
      event: [SCANNED_EVENT, CLOSED_EVENT],
      postEvent: postEvent(),
      params: { text },
      capture(ev) {
        return ev.event === 'scan_qr_popup_closed' || capture(ev.payload.data);
      },
    })
      .then((result) => {
        const qr = result ? result.data : null;
        if (qr !== null) {
          // Some valid QR was scanned. After this, we can close the scanner.
          close();
        }
        return qr;
      })
      .finally(() => {
        _.isOpened.set(false);
      });
  }

  // Stream mode.
  const [, cleanup] = createCleanup(
    on('qr_text_received', ({ data }) => {
      options.onCaptured(data);
    }),
    on('scan_qr_popup_closed', () => {
      _.isOpened.set(false);
    }),
  );

  // When the scanner was closed, remember to perform a cleanup, removing all bound event
  // listeners.
  _.isOpened.sub(cleanup, { once: true });

  postEvent()(OPEN_METHOD, { text: options.text });
}, OPEN_METHOD) as OpenFn;

export { open };
export { isOpened } from './computed.js';
