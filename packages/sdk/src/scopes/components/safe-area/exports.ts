export {
  bindCssVars as bindSafeAreaCssVars,
  isSupported as isSafeAreaSupported,
  mount as mountSafeArea,
  unmount as unmountSafeArea,
} from './methods.js';
export {
  inset as safeAreaInset,
  contentInset as contentSafeAreaInset,

  isMounted as isSafeAreaMounted,
  isCssVarsBound as isSafeAreaCssVarsBound,
  state as safeAreaState,
} from './signals.js';
export type {
  GetCSSVarNameFn as SafeAreaGetCSSVarNameFn,
  State as SafeAreaState,
} from './types.js';
export * as safeArea from './exports.variable.js';