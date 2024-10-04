import { resetSignal } from '@test-utils/reset.js';

import { isRequestingPhoneAccess, isRequestingWriteAccess } from '@/scopes/utilities/privacy/privacy.js';

export function resetPrivacy() {
  [isRequestingPhoneAccess, isRequestingWriteAccess].forEach(resetSignal);
}