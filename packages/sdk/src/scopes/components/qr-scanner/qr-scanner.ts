import {
  CancelablePromise,
  createCbCollector,
  TypedError,
  on,
  EnhancedPromise,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { postEvent } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';
import { createWithIsSupported } from '@/scopes/toolkit/createWithIsSupported.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';

interface OpenSharedOptions extends ExecuteWithOptions {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
}

const WEB_APP_CLOSE_SCAN_QR_POPUP = 'web_app_close_scan_qr_popup';
const WEB_APP_OPEN_SCAN_QR_POPUP = 'web_app_open_scan_qr_popup';
const SCAN_QR_POPUP_CLOSED = 'scan_qr_popup_closed';
const QR_TEXT_RECEIVED = 'qr_text_received';

/**
 * @returns True if the QR scanner is supported.
 */
export const isSupported = createIsSupported(WEB_APP_OPEN_SCAN_QR_POPUP);

const withIsSupported = createWithIsSupported(isSupported);

/**
 * Closes the scanner.
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const close = withIsSupported((): void => {
  isOpened.set(false);
  postEvent(WEB_APP_CLOSE_SCAN_QR_POPUP);
});

/**
 * True if the scanner is currently opened.
 */
export const isOpened = signal(false);

/**
 * Opens the scanner and returns a promise which will be resolved with the QR content if the
 * `capture` function returned true.
 *
 * Promise may also be resolved to null if the scanner was closed.
 * @param options - method options.
 * @returns A promise with QR content presented as string or undefined if the scanner was closed.
 * @throws {TypedError} ERR_ALREADY_CALLED
 */
function _open(options?: OpenSharedOptions & {
  /**
   * Function, which should return true if a scanned QR should be captured.
   * @param qr - scanned QR content.
   */
  capture?: (qr: string) => boolean;
}): CancelablePromise<string | undefined>;

/**
 * Opens the scanner and calls the `onCaptured` function each time, a QR was scanned.
 *
 * The method does not return anything and expects the scanner to be closed externally by a user
 * or via the `close` method.
 * @param options - method options.
 * @throws {TypedError} ERR_ALREADY_CALLED
 */
function _open(options: OpenSharedOptions & {
  /**
   * Function which will be called if some QR code was scanned.
   * @param qr - scanned QR content.
   */
  onCaptured: (qr: string) => void;
}): CancelablePromise<void>;

function _open(options?: OpenSharedOptions & {
  onCaptured?: (qr: string) => void;
  capture?: (qr: string) => boolean;
}): CancelablePromise<string | void> {
  return CancelablePromise.withFn((abortSignal) => {
    if (isOpened()) {
      throw new TypedError(ERR_ALREADY_CALLED);
    }
    isOpened.set(true);

    options ||= {};
    const { onCaptured, text, capture } = options;
    const [, cleanup] = createCbCollector(
      // Whenever the scanner was closed for some reason (by a developer or a user), we should
      // resolve the promise with undefined.
      isOpened.sub(() => {
        promise.resolve();
      }),
      // Whenever user closed the scanner, update the isOpened signal state.
      on(SCAN_QR_POPUP_CLOSED, () => {
        isOpened.set(false);
      }),
      // Whenever some QR was scanned, we should check if it must be captured.
      on(QR_TEXT_RECEIVED, (event) => {
        if (onCaptured) {
          onCaptured(event.data);
        } else if (!capture || capture(event.data)) {
          promise.resolve(event.data);
          close();
        }
      }),
    );

    const promise = new EnhancedPromise<string | void>({ abortSignal })
      .catch(close)
      .finally(cleanup);

    (options.postEvent || postEvent)(WEB_APP_OPEN_SCAN_QR_POPUP, { text });

    return promise;
  }, options);
}

/**
 * @throws {TypedError} ERR_NOT_SUPPORTED
 */
export const open = withIsSupported(_open)