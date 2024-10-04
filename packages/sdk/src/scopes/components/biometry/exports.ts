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
} from './exports.variable.js';
export * as biometry from './exports.variable.js';
export * from './requestBiometry.js';
export type {
  AuthenticateOptions as AuthenticateBiometryOptions,
  State as BiometryState,
  RequestAccessOptions as RequestBiometryAccessOptions,
  UpdateTokenOptions as UpdateBiometryTokenOptions,
} from './types.js';