import { resetSignal } from '@test-utils/reset/reset.js';

import { isRequestingWriteAccess } from '@/scopes/utilities/privacy/requestWriteAccess.js';
import { isRequestingPhoneAccess } from '@/scopes/utilities/privacy/requestPhoneAccess.js';

export function resetPrivacy() {
  [isRequestingPhoneAccess, isRequestingWriteAccess].forEach(resetSignal);
}