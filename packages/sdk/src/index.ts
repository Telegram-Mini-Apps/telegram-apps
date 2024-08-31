export { classNames } from '@/classnames/classNames.js';
export { mergeClassNames, type MergeClassNames } from '@/classnames/mergeClassNames.js';

export { isColorDark } from '@/utils/isColorDark.js';

export { setCssVar, deleteCssVar } from '@/utils/css-vars.js';

export { init } from '@/env/init.js';
export { initWeb } from '@/env/initWeb.js';
export { isSSR } from '@/env/isSSR.js';

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

export * as backButton from '@/scopes/back-button/index.js';
export * as biometryManager from '@/scopes/biometry-manager/index.js';
export * as BiometryManager from '@/scopes/biometry-manager/static.js';
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
export { $postEvent, $version, $createRequestId, configure } from '@/scopes/globals/globals.js';
export * as hapticFeedback from '@/scopes/haptic-feedback/index.js';
export * as initData from '@/scopes/init-data/index.js';
export * as InitData from '@/scopes/init-data/static.js';
export * as invoice from '@/scopes/invoice/index.js';
export * as LaunchParams from '@/scopes/launch-params/static.js';
export * as mainButton from '@/scopes/main-button/index.js';
export * as MainButton from '@/scopes/main-button/static.js';
export * as miniApp from '@/scopes/mini-app/index.js';
export * as MiniApp from '@/scopes/main-button/types.js';
export * as popup from '@/scopes/popup/index.js';
export * as Popup from '@/scopes/popup/static.js';
export * as qrScanner from '@/scopes/qr-scanner/index.js';
export * as QRScanner from '@/scopes/qr-scanner/static.js';
export * as settingsButton from '@/scopes/settings-button/index.js';
export * as swipeBehavior from '@/scopes/swipe-behavior/index.js';
export * as themeParams from '@/scopes/theme-params/index.js';
export * as ThemeParams from '@/scopes/theme-params/static.js';
export * as viewport from '@/scopes/viewport/index.js';
export * as Viewport from '@/scopes/viewport/static.js';

export type {
  Chat,
  ChatType,
  Platform,
  RGB,
  RGBShort,
  User,
  Version,
} from '@telegram-apps/types';