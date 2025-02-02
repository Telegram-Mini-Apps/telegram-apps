export {
  type State as LocationManagerState,
  isAccessGranted as isLocationManagerAccessGranted,
  isAccessRequested as isLocationManagerAccessRequested,
  requestLocationPromise,
  isRequestingLocation,
  requestLocationError,
  isMounted as isLocationManagerMounted,
  isMounting as isLocationManagerMounting,
  mount as mountLocationManager,
  mountError as locationManagerMountError,
  requestLocation,
  mountPromise as locationManagerMountPromise,
  isAvailable as isLocationManagerAvailable,
} from './exports.variable.js';
export * as locationManager from './exports.variable.js';