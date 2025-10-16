import { on } from '@tma.js/bridge';

import { QrScanner } from '@/features/QrScanner/QrScanner.js';
import { pipe } from 'fp-ts/function';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';

export const qrScanner = new QrScanner({
  ...pipe(sharedFeatureOptions(), withVersionBasedPostEvent),
  onClosed(listener) {
    return on('scan_qr_popup_closed', listener);
  },
  onTextReceived(listener) {
    return on('qr_text_received', event => {
      listener(event.data);
    });
  },
});
