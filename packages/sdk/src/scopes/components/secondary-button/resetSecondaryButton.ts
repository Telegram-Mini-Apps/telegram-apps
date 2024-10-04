import { resetSignal } from '@test-utils/reset.js';

import {
  isMounted,
  isVisible,
  state,
  internalState,
  text,
  textColor,
  backgroundColor,
  hasShineEffect,
  isEnabled,
  isLoaderVisible,
  position,
} from './signals.js';

export function resetSecondaryButton() {
  [
    isMounted,
    isVisible,
    state,
    internalState,
    text,
    textColor,
    backgroundColor,
    hasShineEffect,
    isEnabled,
    isLoaderVisible,
    position,
  ].forEach(resetSignal);
}