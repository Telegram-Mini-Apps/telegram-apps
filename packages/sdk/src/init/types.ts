import type { BackButton } from '../back-button/index.js';
import type { PostEvent } from '../bridge/index.js';
import type { ClosingBehavior } from '../closing-behavior/index.js';
import type { CloudStorage } from '../cloud-storage/index.js';
import type { HapticFeedback } from '../haptic-feedback/index.js';
import type { InitData } from '../init-data/index.js';
import type { Invoice } from '../invoice/index.js';
import type { MainButton } from '../main-button/index.js';
import type { MiniApp } from '../mini-app/index.js';
import type { Popup } from '../popup/index.js';
import type { QRScanner } from '../qr-scanner/index.js';
import type { SettingsButton } from '../settings-button/index.js';
import type { ThemeParams } from '../theme-params/index.js';
import type { CreateRequestIdFunc } from '../types/index.js';
import type { Utils } from '../utils/index.js';
import type { Viewport } from '../viewport/index.js';

export interface InitResult {
  backButton: BackButton;
  closingBehavior: ClosingBehavior;
  cloudStorage: CloudStorage;
  createRequestId: CreateRequestIdFunc;
  hapticFeedback: HapticFeedback;
  initData?: InitData;
  initDataRaw?: string;
  invoice: Invoice;
  mainButton: MainButton;
  miniApp: MiniApp;
  popup: Popup;
  postEvent: PostEvent;
  qrScanner: QRScanner;
  settingsButton: SettingsButton;
  themeParams: ThemeParams;
  utils: Utils;
  viewport: Viewport;
}

export interface InitCSSVarsSpecificOption {
  /**
   * Enables theme parameters CSS variables.
   * @see bindThemeCSSVars
   * @default false
   */
  themeParams?: boolean;

  /**
   * Enables viewport CSS variables.
   * @see bindViewportCSSVars
   * @default false
   */
  viewport?: boolean;

  /**
   * Enables mini app CSS variables.
   * @see bindMiniAppCSSVars
   * @default false
   */
  miniApp?: boolean;
}

export type InitCSSVarsOption = boolean | InitCSSVarsSpecificOption;

export interface InitOptions {
  /**
   * @deprecated This option name was considered inappropriate. Use `complete` instead.
   */
  async?: boolean;

  /**
   * True if SDK should accept styles sent from the Telegram web application. This option is only
   * used in web versions of Telegram.
   * @default false
   */
  acceptCustomStyles?: boolean;

  /**
   * Should SDK create global CSS variables related to current Telegram application colors.
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
   * True if initialization must be performed completely. This includes retrieving some components
   * state from the Telegram application, and as a result, this makes initialization asynchronous.
   * @default false
   */
  complete?: boolean;
}
