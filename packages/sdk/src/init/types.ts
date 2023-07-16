import { Bridge, type BridgeProps as BridgeInitOptions } from '@twa.js/bridge';

import {
  BackButton,
  ClosingConfirmation,
  HapticFeedback,
  InitData,
  Layout,
  MainButton,
  Popup,
  QRScanner,
  ThemeParams,
  Viewport,
  WebApp,
} from '../components/index.js';

export interface InitResult {
  backButton: BackButton;
  bridge: Bridge;
  closingConfirmation: ClosingConfirmation;
  haptic: HapticFeedback;
  initData?: InitData;
  layout: Layout;
  mainButton: MainButton;
  popup: Popup;
  qrScanner: QRScanner;
  themeParams: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
}

export interface InitOptions extends Pick<BridgeInitOptions, 'targetOrigin'> {
  /**
   * Should SDK accept scrollbar styles sent from the Telegram web application.
   * This option is only used in Web Z and Web K Telegram applications.
   *
   * You could specify the `false` value to apply your own styles for the
   * scrollbar.
   * @default true
   */
  acceptScrollbarStyle?: boolean;

  /**
   * Enable debug mode.
   * @default false
   */
  debug?: boolean;

  /**
   * Should SDK throw an error in case, unsupported by current version of
   * Web App method was called. It is highly recommended not to disable this
   * feature as long as it helps developer to find issues related to usage
   * of unsupported methods.
   * @default true
   */
  checkCompat?: boolean;
}
