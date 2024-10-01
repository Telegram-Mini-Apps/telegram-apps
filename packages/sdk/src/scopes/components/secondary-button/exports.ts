export {
  isSupported as isSecondaryButtonSupported,
  mount as mountSecondaryButton,
  onClick as onSecondaryButtonClick,
  offClick as offSecondaryButtonClick,
  setParams as setSecondaryButtonParams,
  unmount as unmountSecondaryButton,
} from './methods.js';
export {
  backgroundColor as secondaryButtonBackgroundColor,
  hasShineEffect as secondaryButtonHasShineEffect,
  isMounted as isSecondaryButtonMounted,
  isVisible as isSecondaryButtonVisible,
  isLoaderVisible as isSecondaryButtonLoaderVisible,
  isEnabled as isSecondaryButtonEnabled,
  position as secondaryButtonPosition,
  state as secondaryButtonState,
  text as secondaryButtonText,
  textColor as secondaryButtonTextColor,
} from './signals.js';
export type { State as SecondaryButtonState } from './types.js';
export * as secondaryButton from './exports.variable.js';