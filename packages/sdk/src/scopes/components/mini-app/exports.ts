export {
  bindCssVars as bindMiniAppCssVars,
  close as closeMiniApp,
  isSupported as isMiniAppSupported,
  mount as mountMiniApp,
  ready as miniAppReady,
  setHeaderColor as setMiniAppHeaderColor,
  setBackgroundColor as setMiniAppBackgroundColor,
  setBottomBarColor as setMiniAppBottomBarColor,
  unmount as unmountMiniApp,
} from './methods.js';
export {
  backgroundColor as miniAppBackgroundColor,
  bottomBarColor as miniAppBottomBarColor,
  bottomBarColorRGB as miniAppBottomBarColorRGB,
  headerColor as miniAppHeaderColor,
  headerColorRGB as miniAppHeaderColorRGB,
  isMounted as isMiniAppMounted,
  isCssVarsBound as isMiniAppCssVarsBound,
  isDark as isMiniAppDark,
  state as miniAppState,
} from './signals.js';
export type {
  HeaderColor as MiniAppHeaderColor,
  GetCssVarNameFn as MiniAppGetCssVarNameFn,
  State as MiniAppState,
} from './types.js';
export * as miniApp from './exports.variable.js';