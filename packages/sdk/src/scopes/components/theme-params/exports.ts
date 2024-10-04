export {
  accentTextColor as themeParamsAccentTextColor,
  backgroundColor as themeParamsBackgroundColor,
  bindCssVars as bindThemeParamsCssVars,
  buttonTextColor as themeParamsButtonTextColor,
  buttonColor as themeParamsButtonColor,
  bottomBarBgColor as themeParamsBottomBarBgColor,
  destructiveTextColor as themeParamsDestructiveTextColor,
  headerBackgroundColor as themeParamsHeaderBackgroundColor,
  hintColor as themeParamsHintColor,
  isMounted as isThemeParamsMounted,
  isDark as isThemeParamsDark,
  isCssVarsBound as isThemeParamsCssVarsBound,
  linkColor as themeParamsLinkColor,
  mount as mountThemeParams,
  state as themeParamsState,
  subtitleTextColor as themeParamsSubtitleTextColor,
  sectionBackgroundColor as themeParamsSectionBackgroundColor,
  secondaryBackgroundColor as themeParamsSecondaryBackgroundColor,
  sectionSeparatorColor as themeParamsSectionSeparatorColor,
  sectionHeaderTextColor as themeParamsSectionHeaderTextColor,
  textColor as themeParamsTextColor,
  unmount as unmountThemeParams,
} from './exports.variable.js';
export * as themeParams from './exports.variable.js';
export type {
  GetCssVarNameFn as ThemeParamsGetCssVarNameFn,
  ThemeParams,
  ThemeParamsKey,
} from './types.js';
export * from './parseThemeParams.js';

export { serializeThemeParams } from '@telegram-apps/transformers';
