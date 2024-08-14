import type { WithIsSupported } from '@/scopes/decorateWithIsSupported.js';

export type OpenFn = WithIsSupported<{
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