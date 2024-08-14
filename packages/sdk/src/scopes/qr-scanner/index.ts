import { request, createCleanup, on } from '@telegram-apps/bridge';
import { computed } from '@telegram-apps/signals';

import { decorateWithIsSupported, type WithIsSupported } from '@/scopes/decorateWithIsSupported.js';
import { createError } from '@/errors/createError.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import { ERR_SCANNER_OPENED } from '@/errors/errors.js';

import * as _ from './private.js';
import { OpenFn } from './types.js';

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
  $postEvent()(CLOSE_METHOD);
}, CLOSE_METHOD);

/**
 * True if the scanner is currently opened.
 */
export const isOpened = computed(_.isOpened);

export const open: OpenFn = decorateWithIsSupported((options) => {
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

  $postEvent()(OPEN_METHOD, { text: options.text });
}, OPEN_METHOD) as OpenFn;
