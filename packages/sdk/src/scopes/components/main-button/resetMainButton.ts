import { resetSignal } from '@test-utils/reset.js';

import {
  isMounted,
  isVisible,
  state,
  isLoaderVisible,
  isEnabled,
  hasShineEffect,
  text,
  textColor,
  backgroundColor,
  internalState,
} from './signals.js';

export function resetMainButton() {
  [
    isMounted,
    isVisible,
    state,
    isLoaderVisible,
    isEnabled,
    hasShineEffect,
    text,
    textColor,
    backgroundColor,
    internalState,
  ].forEach(resetSignal);
}