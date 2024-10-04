import { resetSignal } from '@test-utils/reset/reset.js';

import {
  isMounted,
  state,
  mountError,
  isMounting,
  isRequestingAccess,
  isAuthenticating,
} from '@/scopes/components/biometry/signals.js';

export function resetBiometry() {
  [
    isMounted,
    state,
    mountError,
    isMounting,
    isRequestingAccess,
    isAuthenticating,
  ].forEach(resetSignal);
}