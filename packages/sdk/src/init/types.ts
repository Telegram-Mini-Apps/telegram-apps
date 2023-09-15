import type { PostEvent } from '@twa.js/bridge';

import type {
  BackButton,
  ClosingBehaviour,
  CloudStorage,
  HapticFeedback,
  InitData,
  MainButton,
  Popup,
  QRScanner,
  ThemeParams,
  Viewport,
  WebApp,
} from '../components/index.js';
import type { LaunchParams } from '../launch-params.js';

export type InitResult = {
  backButton: BackButton;
  closingBehavior: ClosingBehaviour;
  cloudStorage: CloudStorage;
  haptic: HapticFeedback;
  initData?: InitData;
  initDataRaw?: string;
  mainButton: MainButton;
  popup: Popup;
  postEvent: PostEvent;
  qrScanner: QRScanner;
  themeParams: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
};

export type InitCSSVarsSpecificOption = {
  /**
   * Enables theme parameters CSS variables:
   * - `--tg-theme-bg-color`
   * - `--tg-theme-button-color`
   * - `--tg-theme-button-text-color`
   * - `--tg-theme-hint-color`
   * - `--tg-theme-link-color`
   * - `--tg-theme-secondary-bg-color`
   * - `--tg-theme-text-color`
   *
   * @see bindThemeCSSVariables
   */
  themeParams?: true;

  /**
   * Enables viewport CSS variables:
   * - `--tg-viewport-height`
   * - `--tg-viewport-stable-height`
   *
   * @see bindViewportCSSVariables
   */
  viewport?: true;

  /**
   * Enables web app CSS variables:
   * - `--tg-bg-color`
   * - `--tg-header-color`
   *
   * @see bindWebAppVariables
   */
  webApp?: true;
};

export type InitCSSVarsOption = boolean | InitCSSVarsSpecificOption;

export interface InitOptions {
  /**
   * @deprecated Use acceptCustomStyles
   */
  acceptScrollbarStyle?: boolean;

  /**
   * Should SDK accept styles sent from the Telegram web application.
   * This option is only used in Web versions of Telegram.
   *
   * @default true
   */
  acceptCustomStyles?: boolean;

  /**
   * Should SDK throw an error in case, unsupported by current version of
   * Web App method was called. It is highly recommended not to disable this
   * feature as long as it helps developer to find issues related to usage
   * of unsupported methods.
   *
   * @default true
   */
  checkCompat?: boolean;

  /**
   * Should SDK create global CSS variables related to current Telegram
   * application colors.
   *
   * Possible values:
   * - `false` - no CSS variables will be created.
   * - `true` - all CSS variables will be created.
   * - object - applies specific CSS variables.
   *
   * @default false
   */
  cssVars?: InitCSSVarsOption;

  /**
   * Enable debug mode.
   *
   * @default false
   */
  debug?: boolean;

  /**
   * Launch parameters presented as query parameters or already parsed
   * object. In case, this value is not specified, init
   * function will try to retrieve launch parameters from window.location.hash
   * via retrieveLaunchParams function.
   */
  launchParams?: string | URLSearchParams | LaunchParams;

  /**
   * Sets new targetOrigin, used by bridge's `postEvent` function.
   * @see setTargetOrigin
   */
  targetOrigin?: string;

  /**
   * Initialization process timeout.
   * @default 1000
   */
  timeout?: number;
}
