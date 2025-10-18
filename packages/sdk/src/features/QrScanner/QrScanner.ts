import { computed, type Computed, signal } from '@tma.js/signals';
import { createCbCollector, BetterTaskEither, type BetterTaskEitherError } from '@tma.js/toolkit';
import { BetterPromise } from 'better-promises';
import type { PostEventError } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

import {
  createWithChecksFp,
  type WithChecks,
  type WithChecksFp,
} from '@/with-checks/withChecksFp.js';
import { throwifyWithChecksFp } from '@/with-checks/throwifyWithChecksFp.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { AsyncOptions } from '@/types.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { ConcurrentCallError } from '@/errors.js';
import type { WithVersion } from '@/fn-options/withVersion.js';
import type { WithPostEvent } from '@/fn-options/withPostEvent.js';

export interface QrScannerOptions extends WithVersion, WithPostEvent, SharedFeatureOptions {
  /**
   * A function to add a listener to the event determining if the QR scanner
   * was closed.
   * @param listener - a listener to add.
   * @returns A function to remove the listener.
   */
  onClosed: (listener: VoidFunction) => VoidFunction;
  /**
   * A function to add a listener to the event containing a scanned QR content.
   * @param listener - a listener to add.
   * @returns A function to remove the listener.
   */
  onTextReceived: (listener: (data: string) => void) => VoidFunction;
}

interface SharedOptions extends AsyncOptions {
  /**
   * Title to be displayed in the scanner.
   */
  text?: string;
}

interface CaptureOptions extends SharedOptions {
  /**
   * @returns True if the passed QR code should be captured.
   * @param qr - scanned QR content.
   */
  capture: (qr: string) => boolean;
}

interface OpenOptions extends SharedOptions {
  /**
   * Function which will be called if a QR code was scanned.
   * @param qr - scanned QR content.
   */
  onCaptured: (qr: string) => void;
}

/**
 * @since Mini Apps v6.4
 */
export class QrScanner {
  constructor({
    version,
    onClosed,
    onTextReceived,
    isTma,
    postEvent,
  }: QrScannerOptions) {
    const wrapOptions = { version, requires: 'web_app_open_scan_qr_popup', isTma } as const;
    const wrapSupportedEither = createWithChecksFp({ ...wrapOptions, returns: 'either' });
    const wrapSupportedTask = createWithChecksFp({ ...wrapOptions, returns: 'task' });

    const isOpened = signal(false);
    const toggleClosed = () => {
      isOpened.set(false);
    };

    this.isSupported = createIsSupportedSignal('web_app_open_scan_qr_popup', version);
    this.isOpened = computed(isOpened);

    this.captureFp = wrapSupportedTask(options => {
      let captured: string | undefined;
      return pipe(
        this.openFp({
          ...options,
          onCaptured: qr => {
            if (options.capture(qr)) {
              captured = qr;
              this.close();
            }
          },
        }),
        TE.map(() => captured),
      );
    });
    this.closeFp = wrapSupportedEither(() => {
      return pipe(postEvent('web_app_close_scan_qr_popup'), E.map(toggleClosed));
    });
    this.openFp = wrapSupportedTask(options => {
      return pipe(
        this.isOpened()
          ? TE.left(new ConcurrentCallError('The QR Scanner is already opened'))
          : async () => postEvent('web_app_open_scan_qr_popup', { text: options.text }),
        TE.chainW(() => {
          const [addToCleanup, cleanup] = createCbCollector();
          const withCleanup = <T>(value: T): T => {
            cleanup();
            return value;
          };

          return pipe(
            BetterTaskEither<never, void>(resolve => {
              addToCleanup(onClosed(resolve), onTextReceived(options.onCaptured));
            }, options),
            TE.mapBoth(withCleanup, withCleanup),
          );
        }),
      );
    });

    this.open = throwifyWithChecksFp(this.openFp);
    this.capture = throwifyWithChecksFp(this.captureFp);
    this.close = throwifyWithChecksFp(this.closeFp);
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
   * Opens the scanner and returns a task which will be completed with the QR content if the
   * passed `capture` function returned true.
   *
   * Task may also be completed with undefined if the scanner was closed.
   * @param options - method options.
   * @returns A promise with QR content presented as string or undefined if the scanner was closed.
   * @since Mini Apps v6.4
   * @example
   * pipe(
   *   qrScanner.captureOneFp({
   *     capture(scannedQr) {
   *       return scannedQr === 'any expected by me qr';
   *     }
   *   }),
   *   TE.match(
   *     error => {
   *       console.error(error);
   *     },
   *     qr => {
   *       console.log('My QR:'), qr;
   *     }
   *   ),
   * );
   */
  readonly captureFp: WithChecksFp<
    (options: CaptureOptions) => (
      TE.TaskEither<PostEventError | BetterTaskEitherError, string | undefined>
    ),
    true
  >;

  /**
   * @see captureFp
   */
  readonly capture: WithChecks<
    (options: CaptureOptions) => BetterPromise<string | undefined>,
    true
  >;

  /**
   * Closes the scanner.
   * @since Mini Apps v6.4
   */
  readonly closeFp: WithChecksFp<() => E.Either<PostEventError, void>, true>;

  /**
   * @see close
   */
  readonly close: WithChecks<() => void, true>;

  /**
   * Opens the scanner and returns a task which will be completed when the scanner was closed.
   * @param options - method options.
   * @since Mini Apps v6.4
   * @example Without `capture` option
   * if (qrScanner.open.isAvailable()) {
   *   const qr = await qrScanner.open({ text: 'Scan any QR' });
   * }
   * @example
   * pipe(
   *   qrScanner.openFp({
   *     onCaptured(scannedQr) {
   *       if (scannedQr === 'any expected by me qr') {
   *         qrScanner.close();
   *       }
   *     }
   *   }),
   *   TE.match(
   *     error => {
   *       console.error(error);
   *     },
   *     () => {
   *       console.log('The scanner was closed');
   *     }
   *   ),
   * );
   */
  readonly openFp: WithChecksFp<
    (options: OpenOptions) => TE.TaskEither<PostEventError, void>,
    true
  >;

  /**
   * @see openFp
   */
  readonly open: WithChecks<(options: OpenOptions) => BetterPromise<void>, true>;
}
