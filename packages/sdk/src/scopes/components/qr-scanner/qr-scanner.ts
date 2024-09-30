import {
  CancelablePromise,
  createCbCollector,
  TypedError,
  on,
  EnhancedPromise,
  supports,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';
import { signal } from '@telegram-apps/signals';

import { $version, postEvent } from '@/scopes/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';

interface OpenSharedOptions extends ExecuteWithOptions {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
}

const CLOSE_METHOD = 'web_app_close_scan_qr_popup';
const OPEN_METHOD = 'web_app_open_scan_qr_popup';
const CLOSED_EVENT = 'scan_qr_popup_closed';
const SCANNED_EVENT = 'qr_text_received';

/**
 * Closes the scanner.
 */
export function close(): void {
  isOpened.set(false);
  postEvent(CLOSE_METHOD);
}

/**
 * True if the scanner is currently opened.
 */
export const isOpened = signal(false);

/**
 * @returns True if the QR scanner is supported.
 */
export function isSupported(): boolean {
  return supports(OPEN_METHOD, $version());
}

/**
 * Opens the scanner and returns a promise which will be resolved with the QR content if the
 * `capture` function returned true.
 *
 * Promise may also be resolved to null if the scanner was closed.
 * @param options - method options.
 * @returns A promise with QR content presented as string or undefined if the scanner was closed.
 * @throws {TypedError} ERR_ALREADY_CALLED
 */
export function open(options?: OpenSharedOptions & {
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
export function open(options: OpenSharedOptions & {
  /**
   * Function which will be called if some QR code was scanned.
   * @param qr - scanned QR content.
   */
  onCaptured: (qr: string) => void;
}): CancelablePromise<void>;

export function open(options?: OpenSharedOptions & {
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
      on(CLOSED_EVENT, () => {
        isOpened.set(false);
      }),
      // Whenever some QR was scanned, we should check if it must be captured.
      on(SCANNED_EVENT, (event) => {
        if (onCaptured) {
          onCaptured(event.data);
        } else if (capture && capture(event.data)) {
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
