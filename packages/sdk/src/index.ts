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

export * as biometry from '@/scopes/biometry/instance.js';
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
} from '@/scopes/biometry/instance.js';
export * as Biometry from '@/scopes/biometry/static.js';

export * as closingBehavior from '@/scopes/closing-behavior/instance.js';
export {
  disableConfirmation as disableClosingConfirmation,
  enableConfirmation as enableClosingConfirmation,
  isMounted as isClosingBehaviorMounted,
  isConfirmationEnabled as isClosingConfirmationEnabled,
  mount as mountClosingBehavior,
  unmount as unmountClosingBehavior,
} from '@/scopes/closing-behavior/instance.js';

export * as cloudStorage from '@/scopes/cloud-storage/instance.js';
export {
  getItem as getCloudStorageItem,
  setItem as setCloudStorageItem,
  deleteItem as deleteCloudStorageItem,
  getKeys as getCloudStorageKeys,
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
} from '@/scopes/init-data/instance.js';
export * as InitData from '@/scopes/init-data/static.js';

export * as invoice from '@/scopes/invoice/instance.js';
export {
  isOpened as isInvoiceOpened,
  open as openInvoice,
} from '@/scopes/invoice/instance.js';

export * as LaunchParams from '@/scopes/launch-params/static.js';
export {
  retrieve as retrieveLaunchParams,
} from '@/scopes/launch-params/static.js';

export * as mainButton from '@/scopes/main-button/instance.js';
export {
  backgroundColor as mainButtonBackgroundColor,
  isMounted as isMainButtonMounted,
  isVisible as isMainButtonVisible,
  isActive as isMainButtonActive,
  isLoaderVisible as isMainButtonLoaderVisible,
  mount as mountMainButton,
  onClick as onMainButtonClick,
  offClick as offMainButtonClick,
  setParams as setMainButtonParams,
  state as mainButtonState,
  textColor as mainButtonTextColor,
  text as mainButtonText,
  unmount as unmountMainButton,
} from '@/scopes/main-button/instance.js';
export * as MainButton from '@/scopes/main-button/static.js';

export * as miniApp from '@/scopes/mini-app/instance.js';
export {
  close as closeMiniApp,
  backgroundColor as miniAppBackgroundColor,
  bindCssVars as bindMiniAppCssVars,
  headerColor as miniAppHeaderColor,
  isMounted as isMiniAppMounted,
  isCssVarsBound as isMiniAppCssVarsBound,
  isDark as isMiniAppDark,
  mount as mountMiniApp,
  ready as readyMiniApp,
  state as miniAppState,
  setHeaderColor as setMiniAppHeaderColor,
  setBackgroundColor as setMiniAppBackgroundColor,
  sendData as sendMiniAppData,
  unmount as unmountMiniApp,
} from '@/scopes/mini-app/instance.js';
export * as MiniApp from '@/scopes/main-button/static.js';

export * as popup from '@/scopes/popup/instance.js';
export {
  isOpened as isPopupOpened,
  open as openPopup,
} from '@/scopes/popup/instance.js';
export * as Popup from '@/scopes/popup/static.js';

export * as qrScanner from '@/scopes/qr-scanner/instance.js';
export {
  close as closeQrScanner,
  isOpened as isQrScannerOpened,
  open as openQrScanner,
} from '@/scopes/qr-scanner/instance.js';

export * as settingsButton from '@/scopes/settings-button/instance.js';
export {
  hide as hideSettingsButton,
  isVisible as isSettingsButtonVisible,
  isMounted as isSettingsButtonMounted,
  mount as mountSettingsButton,
  onClick as onSettingsButtonClick,
  offClick as offSettingsButtonClick,
  show as showSettingsButton,
  unmount as unmountSettingsButton,
} from '@/scopes/settings-button/instance.js';

export * as swipeBehavior from '@/scopes/swipe-behavior/instance.js';
export {
  disableVertical as disableVerticalSwipes,
  enableVertical as enableVerticalSwipes,
  isMounted as isSwipeBehaviorMounted,
  isVerticalEnabled as isVerticalSwipesEnabled,
  mount as mountSwipeBehavior,
  unmount as unmountSwipeBehavior,
} from '@/scopes/swipe-behavior/instance.js';

export * as theme from '@/scopes/theme-params/instance.js';
export {
  accentTextColor as themeAccentTextColor,
  backgroundColor as themeBackgroundColor,
  bindCssVars as bindThemeCssVars,
  buttonTextColor as themeButtonTextColor,
  buttonColor as themeButtonColor,
  destructiveTextColor as themeDestructiveTextColor,
  headerBackgroundColor as themeHeaderBackgroundColor,
  hintColor as themeHintColor,
  isMounted as isThemeMounted,
  isDark as isThemeDark,
  isCssVarsBound as isThemeCssVarsBound,
  linkColor as themeLinkColor,
  mount as mountTheme,
  state as themeState,
  subtitleTextColor as themeSubtitleTextColor,
  sectionBackgroundColor as themeSectionBackgroundColor,
  secondaryBackgroundColor as themeSecondaryBackgroundColor,
  sectionSeparatorColor as themeSectionSeparatorColor,
  sectionHeaderTextColor as themeSectionHeaderTextColor,
  textColor as themeTextColor,
  unmount as unmountTheme,
} from '@/scopes/theme-params/instance.js';
export * as Theme from '@/scopes/theme-params/static.js';

export * as viewport from '@/scopes/viewport/instance.js';
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
} from '@/scopes/viewport/instance.js';
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