import { on } from '@telegram-apps/bridge';
import { createCbCollector } from '@telegram-apps/toolkit';
import { CancelablePromise, ManualPromise } from 'better-promises';

import { postEvent } from '@/globals.js';
import { createWrapSupported } from '@/scopes/wrappers/createWrapSupported.js';
import { defineNonConcurrentFn } from '@/scopes/defineNonConcurrentFn.js';
import { createIsSupported } from '@/scopes/createIsSupported.js';
import { signalCancel } from '@/scopes/signalCancel.js';
import type { RequestOptionsNoCapture } from '@/types.js';
import { ignoreCanceled } from '@/utils/ignoreCanceled.js';

interface OpenSharedOptions extends RequestOptionsNoCapture {
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
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (close.isAvailable()) {
 *   close();
 * }
 */
export const close = wrapSupported('close', (): void => {
  postEvent(CLOSE_METHOD);
  signalCancel(openPromise);
});

/**
 * Signal indicating if the QR Scanner is currently opened.
 */
export const isSupported = createIsSupported(OPEN_METHOD);

/**
 * Opens the scanner and returns a promise which will be resolved with the QR content if the
 * passed `capture` function returned true.
 *
 * The `capture` option may be ommited. In this case, the first scanned QR will be returned.
 *
 * Promise may also be resolved to undefined if the scanner was closed.
 * @param options - method options.
 * @returns A promise with QR content presented as string or undefined if the
 * scanner was closed.
 * @since Mini Apps v6.4
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {ConcurrentCallError} The QR Scanner is already opened
 * @example Without `capture` option
 * if (captureOne.isAvailable()) {
 *   const qr = await captureOne({ text: 'Scan any QR' });
 * }
 * @example Using `capture` option
 * if (captureOne.isAvailable()) {
 *   const qr = await captureOne({
 *     text: 'Scan any QR',
 *     capture(scannedQr) {
 *       return scannedQr === 'any expected by me qr';
 *     }
 *   });
 * }
 */
function _open(
  options?: OpenSharedOptions & {
    /**
     * Function, which should return true if the scanned QR should be captured.
     * @param qr - scanned QR content.
     */
    capture?: (qr: string) => boolean;
  },
): CancelablePromise<string | undefined>;

/**
 * Opens the scanner and calls the `onCaptured` function each time, a QR was scanned.
 *
 * The function returns a promise which will be resolved when the QR scanner was closed. It expects
 * the scanner to be closed externally by a user or via the `close` method.
 * @param options - method options.
 * @since Mini Apps v6.4
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @throws {ConcurrentCallError} The QR Scanner is already opened
 * @example
 * if (captureMany.isAvailable()) {
 *   const promise = await captureMany({
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
function _open(
  options: OpenSharedOptions & {
    /**
     * Function which will be called if a QR code was scanned.
     * @param qr - scanned QR content.
     */
    onCaptured: (qr: string) => void;
  },
): CancelablePromise<void>;

function _open(
  options?: OpenSharedOptions & {
    onCaptured?: (qr: string) => void;
    capture?: (qr: string) => boolean;
  },
): CancelablePromise<string | undefined | void> {
  options ||= {};
  const { onCaptured, text, capture } = options;
  const [, cleanup] = createCbCollector(
    on(CLOSED_EVENT, () => {
      promise.resolve();
    }),
    on(TEXT_RECEIVED_EVENT, (event) => {
      if (onCaptured) {
        onCaptured(event.data);
      } else if (!capture || capture(event.data)) {
        promise.resolve(event.data);
        postEvent(CLOSE_METHOD);
      }
    }),
  );

  const promise = new ManualPromise<string | void>(options);
  (options.postEvent || postEvent)(OPEN_METHOD, { text });

  return CancelablePromise.resolve(promise).catch(ignoreCanceled).finally(cleanup);
}

const [
  openFn,
  tOpenPromise,
  tOpenError,
] = defineNonConcurrentFn(_open, 'The QR Scanner is already opened');

export const open = wrapSupported('open', openFn);
export const [, openPromise, isOpened] = tOpenPromise;
export const [, openError] = tOpenError;