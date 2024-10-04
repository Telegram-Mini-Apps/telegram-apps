import { resetSignal } from '@test-utils/reset/reset.js';

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
} from '@/scopes/components/mini-app/signals.js';

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