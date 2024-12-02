export {
  bindCssVars as bindViewportCssVars,
  expand as expandViewport,
  exitFullscreen,
  height as viewportHeight,
  isExpanded as isViewportExpanded,
  isStable as isViewportStable,
  isCssVarsBound as isViewportCssVarsBound,
  isChangingFullscreen,
  isFullscreen,
  isMounting as isViewportMounting,
  isMounted as isViewportMounted,
  mount as mountViewport,
  mountError as viewportMountError,
  mountPromise as viewportMountPromise,
  requestFullscreen,
  changeFullscreenPromise,
  changeFullscreenError,
  state as viewportState,
  stableHeight as viewportStableHeight,
  unmount as unmountViewport,
  width as viewportWidth,
  safeAreaInsetBottom as viewportSafeAreaInsetBottom,
  safeAreaInsetLeft as viewportSafeAreaInsetLeft,
  safeAreaInsetRight as viewportSafeAreaInsetRight,
  safeAreaInsetTop as viewportSafeAreaInsetTop,
  safeAreaInsets as viewportSafeAreaInsets,
  contentSafeAreaInsets as viewportContentSafeAreaInsets,
  contentSafeAreaInsetTop as viewportContentSafeAreaInsetTop,
  contentSafeAreaInsetBottom as viewportContentSafeAreaInsetBottom,
  contentSafeAreaInsetLeft as viewportContentSafeAreaInsetLeft,
  contentSafeAreaInsetRight as viewportContentSafeAreaInsetRight,
} from './exports.variable.js';
export * as viewport from './exports.variable.js';

export { requestContentSafeAreaInsets } from './methods/static/requestContentSafeAreaInsets.js';
export { requestSafeAreaInsets } from './methods/static/requestSafeAreaInsets.js';
export { requestViewport, type RequestViewportResult } from './methods/static/requestViewport.js';
export type {
  State as ViewportState,
  GetCSSVarNameFn as ViewportGetCSSVarNameFn,
  GetCSSVarNameKey as ViewportGetCSSVarNameKey,
} from './types.js';