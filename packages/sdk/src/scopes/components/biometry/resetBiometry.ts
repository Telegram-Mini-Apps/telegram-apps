import { resetSignal } from '@test-utils/reset.js';

import {
  isMounted,
  state,
  mountError,
  isMounting,
  isRequestingAccess,
  isAuthenticating,
} from './signals.js';

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