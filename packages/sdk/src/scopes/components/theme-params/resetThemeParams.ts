import { resetSignal } from '@test-utils/reset.js';

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
} from './signals.js';

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