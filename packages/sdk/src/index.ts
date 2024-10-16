export { classNames } from '@/classnames/classNames.js';
export { mergeClassNames, type MergeClassNames } from '@/classnames/mergeClassNames.js';

export * from '@/scopes/components/back-button/exports.js';
export * from '@/scopes/components/biometry/exports.js';
export * from '@/scopes/components/closing-behavior/exports.js';
export * from '@/scopes/components/cloud-storage/exports.js';
export * from '@/scopes/components/haptic-feedback/exports.js';
export * from '@/scopes/components/init-data/exports.js';
export * from '@/scopes/components/invoice/exports.js';
export * from '@/scopes/components/main-button/exports.js';
export * from '@/scopes/components/mini-app/exports.js';
export * from '@/scopes/components/popup/exports.js';
export * from '@/scopes/components/qr-scanner/exports.js';
export * from '@/scopes/components/secondary-button/exports.js';
export * from '@/scopes/components/settings-button/exports.js';
export * from '@/scopes/components/swipe-behavior/exports.js';
export * from '@/scopes/components/theme-params/exports.js';
export * from '@/scopes/components/viewport/exports.js';
export * from '@/scopes/utilities/links/exports.js';
export * from '@/scopes/utilities/privacy/exports.js';
export * from '@/scopes/utilities/uncategorized/exports.js';

export { $postEvent, $version, $createRequestId } from '@/scopes/globals.js';

export { isColorDark } from '@/utils/isColorDark.js';
export { isSSR } from '@/utils/isSSR.js';
export {
  ERR_POPUP_INVALID_PARAMS,
  ERR_INVALID_HOSTNAME,
  ERR_INVALID_SLUG,
  ERR_ACCESS_DENIED,
  ERR_DATA_INVALID_SIZE,
  ERR_NOT_AVAILABLE,
  ERR_ALREADY_CALLED,
  ERR_NOT_SUPPORTED,
  ERR_NOT_MOUNTED,
} from '@/errors.js';
export { init, type InitOptions } from '@/init.js';

export {
  CancelablePromise,
  defineEventHandlers,
  emitMiniAppsEvent,
  isIframe,
  removeEventHandlers,
  compareVersions,
  createPostEvent,
  $debug,
  ERR_CANCELED,
  ERR_ABORTED,
  ERR_METHOD_PARAMETER_UNSUPPORTED,
  ERR_METHOD_UNSUPPORTED,
  ERR_TIMED_OUT,
  ERR_UNKNOWN_ENV,
  ERR_RETRIEVE_LP_FAILED,
  ERR_CUSTOM_METHOD_ERR_RESPONSE,
  invokeCustomMethod,
  isTMA,
  on,
  off,
  postEvent,
  $targetOrigin,
  request,
  subscribe,
  supports,
  unsubscribe,
  mockTelegramEnv,
  deleteCssVar,
  setCssVar,
  isAbortError,
  isTimeoutError,
  isCanceledError,
  addEventListener,
  retrieveLaunchParams,
  TypedError,
} from '@telegram-apps/bridge';
export type {
  AsyncOptions,
  AnyHapticFeedbackParams,
  AnyInvokeCustomMethodParams,
  BottomBarColor,
  BiometryAuthRequestStatus,
  BiometryTokenUpdateStatus,
  BiometryType,
  Chat,
  ChatType,
  CustomMethodName,
  CustomMethodParams,
  CustomMethodsParams,
  EventListener,
  EventName,
  EventPayload,
  Events,
  ExecuteWithOptions,
  ExecuteWithPostEvent,
  HeaderColorKey,
  ImpactHapticFeedbackParams,
  ImpactHapticFeedbackStyle,
  InvoiceStatus,
  LaunchParams,
  MethodName,
  MethodNameWithOptionalParams,
  MethodNameWithoutParams,
  MethodNameWithRequiredParams,
  MethodNameWithVersionedParams,
  MethodParams,
  Methods,
  MethodVersionedParams,
  NotificationHapticFeedbackParams,
  NotificationHapticFeedbackType,
  OpenLinkBrowser,
  OnUnsupportedFn,
  PhoneRequestedStatus,
  Platform,
  PopupButton,
  PopupParams,
  PostEventFn,
  RequestCaptureEventFn,
  RequestCaptureEventsFn,
  RGB,
  RGBShort,
  SelectionHapticFeedbackParams,
  SwitchInlineQueryChatType,
  ThemeParamsKey,
  User,
  Version,
  WriteAccessRequestedStatus,
  CreatePostEventMode,
  RequestBasicOptions,
  RequestCaptureFn,
  RequestFn,
  RequestResult,
  SubscribeListener,
  TypedErrorOptions,
} from '@telegram-apps/bridge';

export {
  isRGB,
  isRGBShort,
  isRecord,
  toRecord,
  toRGB,
  ERR_UNEXPECTED_VALUE,
  ERR_PARSE,
  ERR_INVALID_VALUE,
  ERR_UNEXPECTED_TYPE,
  serializeLaunchParams,
  serializeThemeParams,
} from '@telegram-apps/transformers';