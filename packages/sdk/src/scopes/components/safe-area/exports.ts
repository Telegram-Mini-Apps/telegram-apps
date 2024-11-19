export {
  bindCssVars as bindSafeAreaCssVars,
  close as closeSafeArea,
  isSupported as isSafeAreaSupported,
  mount as mountSafeArea,
  ready as safeAreaReady,
  setHeaderColor as setSafeAreaHeaderColor,
  setBackgroundColor as setSafeAreaBackgroundColor,
  setBottomBarColor as setSafeAreaBottomBarColor,
  unmount as unmountSafeArea,
} from './methods.js';
export {
  backgroundColor as safeAreaBackgroundColor,
  bottomBarColor as safeAreaBottomBarColor,
  bottomBarColorRGB as safeAreaBottomBarColorRGB,
  headerColor as safeAreaHeaderColor,
  headerColorRGB as safeAreaHeaderColorRGB,
  isMounted as isSafeAreaMounted,
  isCssVarsBound as isSafeAreaCssVarsBound,
  isDark as isSafeAreaDark,
  state as safeAreaState,
} from './signals.js';
export type {
  GetCSSVarNameFn as SafeAreaGetCSSVarNameFn,
  State as SafeAreaState,
} from './types.js';
export * as safeArea from './exports.variable.js';