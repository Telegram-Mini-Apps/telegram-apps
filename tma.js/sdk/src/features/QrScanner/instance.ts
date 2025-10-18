import { on } from '@tma.js/bridge';

import { QrScanner } from '@/features/QrScanner/QrScanner.js';
import { pipe } from 'fp-ts/function';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersion } from '@/fn-options/withVersion.js';
import { withPostEvent } from '@/fn-options/withPostEvent.js';

export const qrScanner = new QrScanner({
  ...pipe(sharedFeatureOptions(), withPostEvent, withVersion),
  onClosed(listener) {
    return on('scan_qr_popup_closed', listener);
  },
  onTextReceived(listener) {
    return on('qr_text_received', event => {
      listener(event.data);
    });
  },
});
