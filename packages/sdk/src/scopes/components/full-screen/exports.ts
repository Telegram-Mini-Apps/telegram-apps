export {
  isFullScreen as isFullScreen,
  requestFullScreen as requestFullScreen,
  exitFullScreen as exitFullScreen,

  isMounted as isFullScreenMounted,
  isSupported as isFullScreenSupported,
  mount as mountFullScreen,
  unmount as unmountFullScreen,

  onChanged as onFullScreenChanged,
  onFailed as onFullScreenFailed,
  offChanged as offFullScreenChanged,
  offFailed as offFullScreenFailed,
} from './exports.variable.js';
export * as fullScreen from './exports.variable.js';