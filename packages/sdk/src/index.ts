export { classNames } from '@/classnames/classNames.js';
export { mergeClassNames, type MergeClassNames } from '@/classnames/mergeClassNames.js';

export { init } from '@/env/init.js';
export { initWeb } from '@/env/initWeb.js';
export { isSSR } from '@/env/isSSR.js';

export { isColorDark } from '@/utils/isColorDark.js';

export { setCssVar, deleteCssVar } from '@/utils/css-vars.js';

export {
  type ErrorType,
  ERR_POPUP_INVALID_PARAMS,
  ERR_INVALID_HOSTNAME,
  ERR_POPUP_OPENED,
  ERR_SCANNER_OPENED,
  ERR_INVOICE_OPENED,
  ERR_INVALID_SLUG,
  ERR_ACCESS_DENIED,
  ERR_CSS_VARS_BOUND,
  ERR_DATA_INVALID_SIZE,
} from '@/errors/errors.js';
export { SDKError } from '@/errors/SDKError.js';

export * as backButton from '@/scopes/back-button/instance.js';
export {
  hide as hideBackButton,
  isVisible as isBackButtonVisible,
  isMounted as isBackButtonMounted,
  mount as mountBackButton,
  onClick as onBackButtonClick,
  offClick as offBackButtonClick,
  show as showBackButton,
  unmount as unmountBackButton,
} from '@/scopes/back-button/instance.js';

export * as biometryManager from '@/scopes/biometry-manager/instance.js';
export * as BiometryManager from '@/scopes/biometry-manager/static.js';

export * as closingConfirmation from '@/scopes/closing-confirmation/instance.js';
export {
  disable as disableClosingConfirmation,
  enable as enableClosingConfirmation,
  isMounted as isClosingConfirmationMounted,
  isEnabled as isClosingConfirmationEnabled,
  mount as mountClosingConfirmation,
  unmount as unmountClosingConfirmation,
} from '@/scopes/closing-confirmation/instance.js';

export * as cloudStorage from '@/scopes/cloud-storage/instance.js';
export {
  getItem as getStorageItem,
  setItem as setStorageItem,
  deleteItem as deleteStorageItem,
  getKeys as getStorageKeys,
} from '@/scopes/cloud-storage/instance.js';

export {
  shareURL,
  openLink,
  type OpenLinkOptions,
  openTelegramLink,
} from '@/scopes/common/links.js';
export {
  requestPhoneAccess,
  requestWriteAccess,
  type RequestedContact,
  requestContact,
} from '@/scopes/common/privacy.js';
export { switchInlineQuery, readTextFromClipboard } from '@/scopes/common/utils.js';
export {
  $postEvent,
  $version,
  $createRequestId,
  configure,
  type ConfigureOptions,
} from '@/scopes/globals/globals.js';

export * as hapticFeedback from '@/scopes/haptic-feedback/instance.js';
export {
  impactOccurred as hapticImpactOccurred,
  notificationOccurred as hapticNotificationOccurred,
  selectionChanged as hapticSelectionChanged,
} from '@/scopes/haptic-feedback/instance.js';

export * as initData from '@/scopes/init-data/instance.js';
export * as InitData from '@/scopes/init-data/static.js';
export * as invoice from '@/scopes/invoice/instance.js';
export * as LaunchParams from '@/scopes/launch-params/static.js';
export * as mainButton from '@/scopes/main-button/instance.js';
export * as MainButton from '@/scopes/main-button/static.js';
export * as miniApp from '@/scopes/mini-app/instance.js';
export * as MiniApp from '@/scopes/main-button/static.js';
export * as popup from '@/scopes/popup/instance.js';
export * as Popup from '@/scopes/popup/static.js';
export * as qrScanner from '@/scopes/qr-scanner/instance.js';
export * as settingsButton from '@/scopes/settings-button/instance.js';
export * as swipeBehavior from '@/scopes/swipe-behavior/instance.js';
export * as themeParams from '@/scopes/theme-params/instance.js';
export * as ThemeParams from '@/scopes/theme-params/static.js';
export * as viewport from '@/scopes/viewport/instance.js';
export * as Viewport from '@/scopes/viewport/static.js';

export {
  BridgeError,
  defineEventHandlers,
  emitMiniAppsEvent,
  isIframe,
  removeEventHandlers,
  compareVersions,
  createPostEvent,
  $debug,
  ERR_INVOKE_CUSTOM_METHOD_RESPONSE,
  ERR_METHOD_PARAMETER_UNSUPPORTED,
  ERR_METHOD_UNSUPPORTED,
  ERR_TIMED_OUT,
  ERR_UNKNOWN_ENV,
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
} from '@telegram-apps/bridge';
export type {
  AnyHapticFeedbackParams,
  AnyInvokeCustomMethodParams,
  BiometryAuthRequestStatus,
  BiometryTokenUpdateStatus,
  BiometryType,
  Chat,
  ChatType,
  CustomMethodName,
  CustomMethodParams,
  CustomMethodsParams,
  ErrorType as BridgeErrorType,
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
} from '@telegram-apps/bridge';

export { isRGB, isRGBShort, toRecord, toRGB } from '@telegram-apps/transformers';