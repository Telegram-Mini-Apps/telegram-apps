export {
  bindCssVars as bindSafeAreaCssVars,
  isSupported as isSafeAreaSupported,
  mount as mountSafeArea,
  unmount as unmountSafeArea,
} from './methods.js';
export {
  safeAreaInsetTop as safeAreaInsetTop,
  safeAreaInsetBottom as safeAreaInsetBottom,
  safeAreaInsetLeft as safeAreaInsetLeft,
  safeAreaInsetRight as safeAreaInsetRight,
  contentSafeAreaInsetTop as contentSafeAreaInsetTop,
  contentSafeAreaInsetBottom as contentSafeAreaInsetBottom,
  contentSafeAreaInsetLeft as contentSafeAreaInsetLeft,
  contentSafeAreaInsetRight as contentSafeAreaInsetRight,

  isMounted as isSafeAreaMounted,
  isCssVarsBound as isSafeAreaCssVarsBound,
  state as safeAreaState,
} from './signals.js';
export type {
  GetCSSVarNameFn as SafeAreaGetCSSVarNameFn,
  State as SafeAreaState,
} from './types.js';
export * as safeArea from './exports.variable.js';