import { resetSignal } from '@test-utils/reset/reset.js';

import {
  state,
  isMounted,
  isCssVarsBound,
  isDark,
  textColor,
  backgroundColor,
  buttonTextColor,
  buttonColor,
  secondaryBackgroundColor,
  headerBackgroundColor,
  linkColor,
  destructiveTextColor,
  sectionBackgroundColor,
  sectionSeparatorColor,
  subtitleTextColor,
  accentTextColor,
  hintColor,
  sectionHeaderTextColor,
  bottomBarBgColor,
} from '@/scopes/components/theme-params/signals.js';

export function resetThemeParams() {
  [
    state,
    isMounted,
    isCssVarsBound,
    isDark,
    textColor,
    backgroundColor,
    buttonTextColor,
    buttonColor,
    secondaryBackgroundColor,
    headerBackgroundColor,
    linkColor,
    destructiveTextColor,
    sectionBackgroundColor,
    sectionSeparatorColor,
    subtitleTextColor,
    accentTextColor,
    hintColor,
    sectionHeaderTextColor,
    bottomBarBgColor,
  ].forEach(resetSignal);
}