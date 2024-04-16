import type { BackButton } from '@/components/back-button/BackButton.js';
import type { ClosingBehavior } from '@/components/closing-behavior/ClosingBehavior.js';
import type { CloudStorage } from '@/components/cloud-storage/CloudStorage.js';
import type { HapticFeedback } from '@/components/haptic-feedback/HapticFeedback.js';
import type { InitData } from '@/components/init-data/InitData.js';
import type { Invoice } from '@/components/invoice/Invoice.js';
import type { MainButton } from '@/components/main-button/MainButton.js';
import type { MiniApp } from '@/components/mini-app/MiniApp.js';
import type { Popup } from '@/components/popup/Popup.js';
import type { QRScanner } from '@/components/qr-scanner/QRScanner.js';
import type { SettingsButton } from '@/components/settings-button/SettingsButton.js';
import type { ThemeParams } from '@/components/theme-params/ThemeParams.js';
import type { Utils } from '@/components/utils/Utils.js';
import type { Viewport } from '@/components/viewport/Viewport.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';

import type { PostEvent } from '../bridge/methods/postEvent.js';

export interface InitResult {
  backButton: BackButton;
  closingBehavior: ClosingBehavior;
  cloudStorage: CloudStorage;
  createRequestId: CreateRequestIdFn;
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
