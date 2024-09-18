import {
  request,
  type AsyncOptions,
  CancelablePromise,
  createCbCollector,
  isCanceledError,
  isTimeoutError,
  isAbortError,
  TypedError,
} from '@telegram-apps/bridge';

import { withIsSupported, type WithIsSupported } from '@/scopes/withIsSupported.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import { ERR_SCANNER_OPENED } from '@/errors/errors.js';
import { SDKError } from '@/errors/SDKError.js';

import { isOpened } from './signals.js';

type OpenFn = WithIsSupported<{
  /**
   * Opens the scanner.
   *
   * Whenever a user scans a QR, the passed `capture` function is being called with the QR
   * content. It should return true if this QR must be captured and promise resolved.
   * @param options - method options.
   * @returns A captured QR content or null, if the scanner was closed.
   */
  (options: AsyncOptions & {
    /**
     * Title to be displayed in the scanner.
     */
    text?: string;
    /**
     * Function, which should return true if a scanned QR should be captured and promise resolved.
     * @param qr - scanned QR content.
     */
    capture(this: void, qr: string): boolean;
  }): CancelablePromise<string | null>;
  /**
   * Opens the scanner in stream mode.
   *
   * Whenever a user scans a QR, the passed `onCaptured` function will be called.
   * @param options - method options.
   */
  (options: AsyncOptions & {
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
}>

const CLOSE_METHOD = 'web_app_close_scan_qr_popup';
const OPEN_METHOD = 'web_app_open_scan_qr_popup';
const CLOSED_EVENT = 'scan_qr_popup_closed';
const SCANNED_EVENT = 'qr_text_received';

/**
 * Closes the scanner.
 */
export const close = withIsSupported((): void => {
  isOpened.set(false);
  $postEvent()(CLOSE_METHOD);
}, CLOSE_METHOD);

export const open: OpenFn = withIsSupported((options) => {
  if (isOpened()) {
    throw new SDKError(ERR_SCANNER_OPENED);
  }
  isOpened.set(true);

  const { text } = options;

  // Capture single QR mode.
  if ('capture' in options) {
    const { capture } = options;

    return request(OPEN_METHOD, [SCANNED_EVENT, CLOSED_EVENT], {
      ...options,
      postEvent: $postEvent(),
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
        isOpened.set(false);
      });
  }

  // Stream mode.

  let cleanup: VoidFunction;
  return new CancelablePromise((res) => {
    [, cleanup] = createCbCollector(
      on('qr_text_received', ({ data }) => {
        options.onCaptured(data);
      }),
      on('scan_qr_popup_closed', () => {
        isOpened.set(false);
      }),
      // Whenever the scanner open state was changed, it means, it was closed by the developer.
      // We interpret such an action as a successful QR scan.
      isOpened.sub(res),
    );

    $postEvent()(OPEN_METHOD, { text: options.text });
  }, options)
    .then(() => {
      isOpened.set(false);
    })
    .catch(close)
    .finally(cleanup!);
}, OPEN_METHOD) as OpenFn;
