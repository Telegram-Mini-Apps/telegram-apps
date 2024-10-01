export { classNames } from '@/classnames/classNames.js';
export { mergeClassNames, type MergeClassNames } from '@/classnames/mergeClassNames.js';

export * as backButton from '@/scopes/components/back-button/back-button.js';
export {
  hide as hideBackButton,
  isVisible as isBackButtonVisible,
  isMounted as isBackButtonMounted,
  isSupported as isBackButtonSupported,
  mount as mountBackButton,
  onClick as onBackButtonClick,
  offClick as offBackButtonClick,
  show as showBackButton,
  unmount as unmountBackButton,
} from '@/scopes/components/back-button/back-button.js';

export * as biometry from '@/scopes/components/biometry/instance.js';
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
} from '@/scopes/components/biometry/instance.js';
export * as Biometry from '@/scopes/components/biometry/static.js';

export * as closingBehavior from '@/scopes/components/closing-behavior/closing-behavior.js';
export {
  disableConfirmation as disableClosingConfirmation,
  enableConfirmation as enableClosingConfirmation,
  isMounted as isClosingBehaviorMounted,
  isConfirmationEnabled as isClosingConfirmationEnabled,
  mount as mountClosingBehavior,
  unmount as unmountClosingBehavior,
} from '@/scopes/components/closing-behavior/closing-behavior.js';

export * as cloudStorage from '@/scopes/components/cloud-storage/cloud-storage.js';
export {
  isSupported as isCloudStorageSupported,
  getItem as getCloudStorageItem,
  setItem as setCloudStorageItem,
  deleteItem as deleteCloudStorageItem,
  getKeys as getCloudStorageKeys,
} from '@/scopes/components/cloud-storage/cloud-storage.js';

export * as hapticFeedback from '@/scopes/components/haptic-feedback/haptic-feedback.js';
export {
  impactOccurred as hapticFeedbackImpactOccurred,
  isSupported as isHapticFeedbackSupported,
  notificationOccurred as hapticFeedbackNotificationOccurred,
  selectionChanged as hapticFeedbackSelectionChanged,
} from '@/scopes/components/haptic-feedback/haptic-feedback.js';

export * as initData from '@/scopes/components/init-data/instance.js';
export {
  state as initDataState,
  raw as initDataRaw,
  authDate as initDataAuthDate,
  chat as initDataChat,
  chatInstance as initDataChatInstance,
  chatType as initDataChatType,
  hash as initDataHash,
  canSendAfter as initDataCanSendAfter,
  canSendAfterDate as initDataCanSendAfterDate,
  queryId as initDataQueryId,
  restore as restoreInitData,
  user as initDataUser,
  receiver as initDataReceiver,
  startParam as initDataStartParam,
} from '@/scopes/components/init-data/instance.js';
export * as InitData from '@/scopes/components/init-data/static.js';

export * as invoice from '@/scopes/components/invoice/invoice.js';
export {
  isSupported as isInvoiceSupported,
  isOpened as isInvoiceOpened,
  open as openInvoice,
} from '@/scopes/components/invoice/invoice.js';

export * from '@/scopes/components/main-button/exports.js';
export * from '@/scopes/components/mini-app/exports.js';

export * as popup from '@/scopes/components/popup/instance.js';
export {
  isOpened as isPopupOpened,
  isSupported as isPopupSupported,
  open as openPopup,
} from '@/scopes/components/popup/instance.js';
export * as Popup from '@/scopes/components/popup/static.js';

export * as qrScanner from '@/scopes/components/qr-scanner/qr-scanner.js';
export {
  close as closeQrScanner,
  isSupported as isQrScannerSupported,
  isOpened as isQrScannerOpened,
  open as openQrScanner,
} from '@/scopes/components/qr-scanner/qr-scanner.js';

export * from '@/scopes/components/secondary-button/exports.js';

export * as settingsButton from '@/scopes/components/settings-button/settings-button.js';
export {
  hide as hideSettingsButton,
  isVisible as isSettingsButtonVisible,
  isMounted as isSettingsButtonMounted,
  isSupported as isSettingsButtonSupported,
  mount as mountSettingsButton,
  onClick as onSettingsButtonClick,
  offClick as offSettingsButtonClick,
  show as showSettingsButton,
  unmount as unmountSettingsButton,
} from '@/scopes/components/settings-button/settings-button.js';

export * as swipeBehavior from '@/scopes/components/swipe-behavior/swipe-behavior.js';
export {
  disableVertical as disableVerticalSwipes,
  enableVertical as enableVerticalSwipes,
  isMounted as isSwipeBehaviorMounted,
  isVerticalEnabled as isVerticalSwipesEnabled,
  isSupported as isSwipeBehaviorSupported,
  mount as mountSwipeBehavior,
  unmount as unmountSwipeBehavior,
} from '@/scopes/components/swipe-behavior/swipe-behavior.js';

export * as themeParams from '@/scopes/components/theme-params/instance.js';
export {
  accentTextColor as themeParamsAccentTextColor,
  backgroundColor as themeParamsBackgroundColor,
  bindCssVars as bindThemeParamsCssVars,
  buttonTextColor as themeParamsButtonTextColor,
  buttonColor as themeParamsButtonColor,
  bottomBarBgColor as themeParamsBottomBarBgColor,
  destructiveTextColor as themeParamsDestructiveTextColor,
  headerBackgroundColor as themeParamsHeaderBackgroundColor,
  hintColor as themeParamsHintColor,
  isMounted as isThemeParamsMounted,
  isDark as isThemeParamsDark,
  isCssVarsBound as isThemeParamsCssVarsBound,
  linkColor as themeParamsLinkColor,
  mount as mountThemeParams,
  state as themeParamsState,
  subtitleTextColor as themeParamsSubtitleTextColor,
  sectionBackgroundColor as themeParamsSectionBackgroundColor,
  secondaryBackgroundColor as themeParamsSecondaryBackgroundColor,
  sectionSeparatorColor as themeParamsSectionSeparatorColor,
  sectionHeaderTextColor as themeParamsSectionHeaderTextColor,
  textColor as themeParamsTextColor,
  unmount as unmountThemeParams,
} from '@/scopes/components/theme-params/instance.js';
export * as ThemeParams from '@/scopes/components/theme-params/static.js';

export * as viewport from '@/scopes/components/viewport/instance.js';
export {
  bindCssVars as bindViewportCssVars,
  expand as expandViewport,
  height as viewportHeight,
  isExpanded as isViewportExpanded,
  isStable as isViewportStable,
  isCssVarsBound as isViewportCssVarsBound,
  isMounting as isViewportMounting,
  isMounted as isViewportMounted,
  mount as mountViewport,
  mountError as viewportMountError,
  state as viewportState,
  stableHeight as viewportStableHeight,
  unmount as unmountViewport,
  width as viewportWidth,
} from '@/scopes/components/viewport/instance.js';
export * as Viewport from '@/scopes/components/viewport/static.js';

export {
  openLink,
  openTelegramLink,
  shareURL,
  type OpenLinkOptions,
} from '@/scopes/utilities/links/links.js';
export {
  requestPhoneAccess,
  requestWriteAccess,
  requestContact,
  type RequestedContact,
} from '@/scopes/utilities/privacy/privacy.js';
export {
  readTextFromClipboard,
  sendData,
  switchInlineQuery,
  shareStory,
} from '@/scopes/utilities/uncategorized/uncategorized.js';

export {
  $postEvent,
  $version,
  $createRequestId,
} from '@/scopes/globals.js';

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