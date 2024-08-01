/**
 * Bridge.
 */
export { defineEventHandlers, removeEventHandlers } from '@/bridge/events/handlers.js';
export { on, off, subscribe, unsubscribe } from '@/bridge/events/listening.js';
export { createPostEvent } from '@/bridge/methods/createPostEvent.js';
export { postEvent, type PostEvent } from '@/bridge/methods/postEvent.js';
export { invokeCustomMethod } from '@/bridge/invokeCustomMethod.js';
export {
  request,
  type RequestEventsPayloads,
  type RequestCaptureEventsFn,
  type RequestCaptureEventFn,
  type RequestOptions,
} from '@/bridge/request.js';
export { supports } from '@/bridge/supports.js';
export { resetTargetOrigin, setTargetOrigin, targetOrigin } from '@/bridge/target-origin.js';
export * as MiniApps from '@/bridge/types.js';

/**
 * Classnames.
 */
export { classNames } from '@/classnames/classNames.js';
export { mergeClassNames, type MergeClassNames } from '@/classnames/mergeClassNames.js';

/**
 * Colors.
 */
export { isColorDark } from '@/colors/isColorDark.js';
export { isRGB } from '@/colors/isRGB.js';
export { isRGBShort } from '@/colors/isRGBShort.js';
export { toRGB } from '@/colors/toRGB.js';
export type { RGB, RGBShort } from '@/colors/types.js';

/**
 * CSS Variables.
 */
// FIXME

/**
 * Debug.
 */
export { setDebug } from '@/debug/debug.js';

/**
 * Env.
 */
export { init } from '@/env/init.js';
export { isIframe } from '@/env/isIframe.js';
export { isSSR } from '@/env/isSSR.js';
export { isTMA } from '@/env/isTMA.js';
export { mockTelegramEnv } from '@/env/mockTelegramEnv.js';

/**
 * Errors.
 */
export * as ERRORS from '@/errors/errors.js';
export type { ErrorType } from '@/errors/errors.js';
export { isSDKError } from '@/errors/isSDKError.js';
export { isSDKErrorOfType } from '@/errors/isSDKErrorOfType.js';
export { SDKError } from '@/errors/SDKError.js';

/**
 * Events.
 */
export type { RemoveEventListenerFn } from '@/events/types.js';

/**
 * Launch params.
 */
export { parseLaunchParams } from '@/launch-params/parseLaunchParams.js';
export { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
export { serializeLaunchParams } from '@/launch-params/serializeLaunchParams.js';
export type * from '@/launch-params/types.js';

/**
 * Navigation.
 */
export { BasicNavigator } from '@/navigation/BasicNavigator/BasicNavigator.js';
export type {
  BasicNavigatorAnyHistoryItem,
  BasicNavigatorEvents,
  BasicNavigatorHistoryItem,
} from '@/navigation/BasicNavigator/types.js';
export { BrowserNavigator } from '@/navigation/BrowserNavigator/BrowserNavigator.js';
export {
  createBrowserNavigatorFromLocation,
} from '@/navigation/BrowserNavigator/createBrowserNavigatorFromLocation.js';
export { createSafeURL } from '@/navigation/createSafeURL.js';
export { getHash } from '@/navigation/getHash.js';
export { getPathname } from '@/navigation/getPathname.js';
export { initNavigator } from '@/navigation/initNavigator.js';
export { isPageReload } from '@/navigation/isPageReload.js';
export { urlToPath } from '@/navigation/urlToPath.js';
export type {
  BrowserNavigatorAnyHistoryItem,
  BrowserNavigatorConOptions,
  BrowserNavigatorEvents,
  BrowserNavigatorHashMode,
  BrowserNavigatorHistoryItem,
  URLLike,
} from '@/navigation/BrowserNavigator/types.js';

/**
 * Parsing.
 */
export { array } from '@/parsing/parsers/array.js';
export { boolean } from '@/parsing/parsers/boolean.js';
export { date } from '@/parsing/parsers/date.js';
export { json } from '@/parsing/parsers/json.js';
export { number } from '@/parsing/parsers/number.js';
export { rgb } from '@/parsing/parsers/rgb.js';
export { searchParams } from '@/parsing/parsers/searchParams.js';
export { string } from '@/parsing/parsers/string.js';

/**
 * SCOPES
 */
export * as backButton from '@/scopes/back-button/index.js';

export * as biometryManager from '@/scopes/biometry-manager/index.js';
export * as BiometryManager from '@/scopes/biometry-manager/static.js';
export type * from '@/scopes/biometry-manager/types.js';

export * as closingBehavior from '@/scopes/closing-behavior/index.js';
export * as cloudStorage from '@/scopes/cloud-storage/index.js';

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

export * as Globals from '@/scopes/globals/globals.js';
export * as hapticFeedback from '@/scopes/haptic-feedback/index.js';

export * as InitData from '@/scopes/init-data/static.js';
export * as initData from '@/scopes/init-data/index.js';
export type * from '@/scopes/init-data/types.js';

export * as invoice from '@/scopes/invoice/index.js';

export * as mainButton from '@/scopes/main-button/index.js';
export type * as MainButton from '@/scopes/main-button/types.js';

export * as miniApp from '@/scopes/mini-app/index.js';
export type * as MiniApp from '@/scopes/main-button/types.js';

export * as popup from '@/scopes/popup/index.js';
export type * as Popup from '@/scopes/popup/types.js';

export * as qrScanner from '@/scopes/qr-scanner/index.js';
export * as settingsButton from '@/scopes/settings-button/index.js';
export * as swipeBehavior from '@/scopes/swipe-behavior/index.js';

export * as ThemeParams from '@/scopes/theme-params/static.js';
export * as themeParams from '@/scopes/theme-params/themeParams.js';
export type * from '@/scopes/theme-params/types.js';

export * as viewport from '@/scopes/viewport/index.js';
export * as Viewport from '@/scopes/viewport/static.js';
export type * from '@/scopes/viewport/types.js';

/**
 * Signals.
 */
export { signal, type Signal, type SignalOptions } from '@/signals/signal/signal.js';
export { computed, type Computed } from '@/signals/computed/computed.js';
export type { ListenerFn, UnsubscribeFn } from '@/signals/types.js';

/**
 * Timeout.
 */
export { withTimeout } from '@/timeout/withTimeout.js';

/**
 * Types.
 */
export * from '@/types/index.js';

/**
 * Version.
 */
export { compareVersions } from '@/version/compareVersions.js';
export type { Version } from '@/version/types.js';
