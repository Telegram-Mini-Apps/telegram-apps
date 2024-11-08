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
import { ERR_ALREADY_OPENED } from '@/errors.js';
import { createIsSupported } from '@/scopes/toolkit/createIsSupported.js';
import { createWrapSupported } from '@/scopes/toolkit/createWrapSupported.js';

interface OpenSharedOptions extends ExecuteWithOptions {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
}

const CLOSE_METHOD = 'web_app_close_scan_qr_popup';
const OPEN_METHOD = 'web_app_open_scan_qr_popup';
const CLOSED_EVENT = 'scan_qr_popup_closed';
const TEXT_RECEIVED_EVENT = 'qr_text_received';

const wrapSupported = createWrapSupported('qrScanner', OPEN_METHOD);

/**
 * Closes the scanner.
 * @since Mini Apps v6.4
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @example
 * if (close.isAvailable()) {
 *   close();
 * }
 */
export const close = wrapSupported('close', (): void => {
  isOpened.set(false);
  postEvent(CLOSE_METHOD);
});

/**
 * True if the scanner is currently opened.
 */
export const isOpened = signal(false);

/**
 * Signal indicating if the QR Scanner is currently opened.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

/**
 * Opens the scanner and returns a promise which will be resolved with the QR
 * content if the passed `capture` function returned true.
 *
 * The `capture` option may be ommited. In this case, the first scanned QR
 * will be returned.
 *
 * Promise may also be resolved to undefined if the scanner was closed.
 * @param options - method options.
 * @returns A promise with QR content presented as string or undefined if the
 * scanner was closed.
 * @since Mini Apps v6.4
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @example Without `capture` option
 * if (open.isAvailable()) {
 *   const qr = await open({ text: 'Scan any QR' });
 * }
 * @example Using `capture` option
 * if (open.isAvailable()) {
 *   const qr = await open({
 *     text: 'Scan any QR',
 *     capture(scannedQr) {
 *       return scannedQr === 'any expected by me qr';
 *     }
 *   });
 * }
 */
function _open(options?: OpenSharedOptions & {
  /**
   * Function, which should return true if the scanned QR should be captured.
   * @param qr - scanned QR content.
   */
  capture?: (qr: string) => boolean;
}): CancelablePromise<string | undefined>;

/**
 * Opens the scanner and calls the `onCaptured` function each time, a QR was
 * scanned.
 *
 * The function returns a promise which will be resolved when the QR scanner
 * was closed. It expects the scanner to be closed externally by a user or
 * via the `close` method.
 * @param options - method options.
 * @since Mini Apps v6.4
 * @throws {TypedError} ERR_UNKNOWN_ENV
 * @throws {TypedError} ERR_NOT_INITIALIZED
 * @throws {TypedError} ERR_NOT_SUPPORTED
 * @throws {TypedError} ERR_ALREADY_OPENED
 * @example
 * if (open.isAvailable()) {
 *   const promise = await open({
 *     text: 'Scan any QR',
 *     onCaptured(scannedQr) {
 *       if (scannedQr === 'any expected by me qr') {
 *         close();
 *       }
 *     }
 *   });
 *   console.log('The scanner was closed');
 * }
 */
function _open(options: OpenSharedOptions & {
  /**
   * Function which will be called if a QR code was scanned.
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
      throw new TypedError(ERR_ALREADY_OPENED, 'The QR Scanner is already opened');
    }
    isOpened.set(true);

    options ||= {};
    const { onCaptured, text, capture } = options;
    const [, cleanup] = createCbCollector(
      // Whenever the scanner was closed for some reason (by a developer or a
      // user), we should resolve the promise with undefined.
      isOpened.sub(() => {
        promise.resolve();
      }),
      // Whenever user closed the scanner, update the isOpened signal state.
      on(CLOSED_EVENT, () => {
        isOpened.set(false);
      }),
      // Whenever some QR was scanned, we should check if it must be captured.
      on(TEXT_RECEIVED_EVENT, (event) => {
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

    (options.postEvent || postEvent)(OPEN_METHOD, { text });

    return promise;
  }, options);
}

export const open = wrapSupported('open', _open);