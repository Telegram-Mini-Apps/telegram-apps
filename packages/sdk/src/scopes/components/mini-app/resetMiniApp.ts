import { resetSignal } from '@test-utils/reset.js';

import {
  isMounted,
  state,
  backgroundColor,
  backgroundColorRGB,
  bottomBarColorRGB,
  headerColorRGB,
  bottomBarColor,
  headerColor,
  isCssVarsBound,
  isDark,
} from './signals.js';

export function resetMiniApp() {
  [
    isMounted,
    state,
    backgroundColor,
    backgroundColorRGB,
    bottomBarColorRGB,
    headerColorRGB,
    bottomBarColor,
    headerColor,
    isCssVarsBound,
    isDark,
  ].forEach(resetSignal);
}