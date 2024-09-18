import {
  CancelablePromise,
  createCbCollector,
  isCanceledError,
  isTimeoutError,
  isAbortError,
  TypedError,
  type ExecuteWithOptions,
} from '@telegram-apps/bridge';

import { withIsSupported } from '@/scopes/withIsSupported.js';
import { postEvent, request } from '@/scopes/globals/globals.js';
import { ERR_ALREADY_CALLED } from '@/errors.js';

import { isOpened } from './signals.js';

const CLOSE_METHOD = 'web_app_close_scan_qr_popup';
const OPEN_METHOD = 'web_app_open_scan_qr_popup';
const CLOSED_EVENT = 'scan_qr_popup_closed';
const SCANNED_EVENT = 'qr_text_received';

/**
 * Closes the scanner.
 */
export const close = withIsSupported((): void => {
  isOpened.set(false);
  postEvent(CLOSE_METHOD);
}, CLOSE_METHOD);

interface OpenSharedOptions extends ExecuteWithOptions {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
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
}): CancelablePromise<string | undefined | void> {
  if (isOpened()) {
    throw new TypedError(ERR_ALREADY_CALLED);
  }
  isOpened.set(true);

  const [, cleanup] = createCbCollector(
    // The scanner could potentially be closed outside via the close method.
    // We should track the open state change and resolve the promise to imitate
    // the scan_qr_popup_closed event.
    isOpened.sub(() => {
      promise.resolve();
    }),
  );

  options ||= {};
  const { capture, onCaptured } = options;
  const promise = request(OPEN_METHOD, [SCANNED_EVENT, CLOSED_EVENT], {
    ...options,
    params: { text: options.text },
    capture(ev) {
      if (ev.event === 'scan_qr_popup_closed') {
        return true;
      }
      const { data } = ev.payload;
      onCaptured && onCaptured(data);
      return capture ? capture(data) : false;
    },
  })
    .then(result => {
      // The promise was resolved. It was either closed by a user or developer. In this case, we
      // just check if something was scanned. In case it was, close the scanner and return
      // the QR content.
      if (result) {
        close();
        return result.data;
      }
    })
    .catch(e => {
      close();

      // We may have an error in case, something with the promise went wrong. It can be canceled,
      // timed out or aborted. In this case, it is required to close the scanner.
      if (!isAbortError(e) && !isTimeoutError(e) && !isCanceledError(e)) {
        throw e;
      }
    })
    .finally(cleanup);

  return promise;
}

export const open = withIsSupported(_open, OPEN_METHOD);
