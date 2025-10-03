import { computed, type Computed, signal } from '@tma.js/signals';
import { createCbCollector } from '@tma.js/toolkit';
import { BetterPromise, CancelledError } from 'better-promises';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { RequestOptionsNoCapture } from '@/types.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { ConcurrentCallError } from '@/errors.js';

export interface QrScannerOptions
  extends WithVersionBasedPostEvent,
  SharedFeatureOptions {
  /**
   * A function to add a listener to the event determining if the QR scanner
   * was closed.
   * @param listener - a listener to add.
   * @returns A function to remove the listener.
   */
  onScannerClosed: (listener: VoidFunction) => VoidFunction;
  /**
   * A function to add a listener to the event containing a scanned QR content.
   * @param listener - a listener to add.
   * @returns A function to remove the listener.
   */
  onScannerTextReceived: (listener: (data: string) => void) => VoidFunction;
}

interface OpenSharedOptions extends RequestOptionsNoCapture {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
}

interface OpenFn {
  (options?: OpenSharedOptions & {
    /**
     * Function, which should return true if the scanned QR should be captured.
     * @param qr - scanned QR content.
     */
    capture?: (qr: string) => boolean;
  }): BetterPromise<string | undefined>;
  (options: OpenSharedOptions & {
    /**
     * Function which will be called if a QR code was scanned.
     * @param qr - scanned QR content.
     */
    onCaptured: (qr: string) => void;
  }): BetterPromise<void>;
}

/**
 * @since Mini Apps v6.4
 */
export class QrScanner {
  constructor({
    version,
    onScannerClosed,
    onScannerTextReceived,
    isTma,
    postEvent,
  }: QrScannerOptions) {
    const wrapSupported = createWrapSafe({
      version,
      isSupported: 'web_app_open_scan_qr_popup',
      isTma,
    });

    const openPromise = signal<BetterPromise<string | void | undefined>>();

    this.isSupported = createIsSupportedSignal('web_app_open_scan_qr_popup', version);
    this.isOpened = computed(() => !!openPromise);
    this.close = wrapSupported(() => {
      postEvent('web_app_close_scan_qr_popup');
      openPromise()?.cancel();
    });
    this.open = wrapSupported(
      ((
        options: OpenSharedOptions & {
          onCaptured?: (qr: string) => void;
          capture?: (qr: string) => boolean;
        } = {},
      ) => {
        if (this.isOpened()) {
          return BetterPromise.reject(new ConcurrentCallError('The QR Scanner is already opened'));
        }

        const error = pipe(
          postEvent('web_app_open_scan_qr_popup', { text: options.text }),
          E.match(e => e, () => undefined),
        );
        if (error) {
          return BetterPromise.reject(error);
        }

        const [addToCleanup, cleanup] = createCbCollector(() => {
          openPromise.set(undefined);
        });
        const promise = new BetterPromise<string | undefined>(resolve => {
          const { capture, onCaptured } = options;

          addToCleanup(
            onScannerClosed(resolve),
            onScannerTextReceived(data => {
              if (onCaptured) {
                onCaptured(data);
                return;
              }
              if (!capture || capture(data)) {
                resolve(data);
                postEvent('web_app_close_scan_qr_popup');
              }
            }),
          );
        }, options)
          .catch(e => {
            if (!CancelledError.is(e)) {
              throw e;
            }
          })
          .finally(cleanup);

        openPromise.set(promise);

        return promise;
      }) as OpenFn,
    );
  }

  /**
   * Signal indicating if the scanner is currently opened.
   */
  readonly isOpened: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Opens the scanner and returns a promise which will be resolved with the QR content if the
   * passed `capture` function returned true.
   *
   * The `capture` option may be omitted. In this case, the first scanned QR will be returned.
   *
   * Promise may also be resolved to undefined if the scanner was closed.
   * @param options - method options.
   * @returns A promise with QR content presented as string or undefined if the
   * scanner was closed.
   * @since Mini Apps v6.4
   * @throws {ConcurrentCallError} The QR Scanner is already opened
   * @example Without `capture` option
   * if (qrScanner.open.isAvailable()) {
   *   const qr = await qrScanner.open({ text: 'Scan any QR' });
   * }
   * @example Using `capture` option
   * if (qrScanner.open.isAvailable()) {
   *   const qr = await qrScanner.open({
   *     text: 'Scan any QR',
   *     capture(scannedQr) {
   *       return scannedQr === 'any expected by me qr';
   *     }
   *   });
   * }
   */
  readonly open: SafeWrapped<OpenFn, true>;

  /**
   * Closes the scanner.
   * @since Mini Apps v6.4
   * @example
   * if (qrScanner.close.isAvailable()) {
   *   qrScanner.close();
   * }
   */
  readonly close: SafeWrapped<() => void, true>;
}
