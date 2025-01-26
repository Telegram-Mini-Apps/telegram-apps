export {
  authenticate as authenticateBiometry,
  isMounting as isBiometryMounting,
  isMounted as isBiometryMounted,
  isSupported as isBiometrySupported,
  mount as mountBiometry,
  mountError as biometryMountError,
  openSettings as openBiometrySettings,
  requestAccess as requestBiometryAccess,
  state as biometryState,
  unmount as unmountBiometry,
  updateToken as updateBiometryToken,
  isAuthenticating as isAuthenticatingBiometry,
  isRequestingAccess as isRequestingBiometryAccess,
  requestAccessPromise as requestBiometryAccessPromise,
  requestAccessError as requestBiometryAccessError,
  mountPromise as mountBiometryPromise,
  authError as biometryAuthError,
  authPromise as biometryAuthPromise,
  isAvailable as isBiometryAvailable,
} from './exports.variable.js';
export * as biometry from './exports.variable.js';

export { requestBiometry } from './requestBiometry.js';
export type {
  AuthenticateOptions as AuthenticateBiometryOptions,
  State as BiometryState,
  RequestAccessOptions as RequestBiometryAccessOptions,
  UpdateTokenOptions as UpdateBiometryTokenOptions,
} from './types.js';