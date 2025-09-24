import { isTMAFp, requestFp } from '@tma.js/bridge';

import { Invoice } from '@/features/Invoice/Invoice.js';
import { version } from '@/globals/version.js';

export const invoice = new Invoice({
  version,
  isTma: isTMAFp,
  request: requestFp,
});
