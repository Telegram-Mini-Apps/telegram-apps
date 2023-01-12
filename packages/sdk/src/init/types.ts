import {Bridge, InitOptions as BridgeInitOptions} from 'twa-bridge';

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
} from '../components';

export interface InitResult {
  backButton: BackButton;
  bridge: Bridge;
  closingConfirmation: ClosingConfirmation;
  haptic: HapticFeedback;
  initData: InitData;
  layout: Layout;
  mainButton: MainButton;
  popup: Popup;
  qrScanner: QRScanner;
  themeParams: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
}

export interface InitOptions extends Pick<BridgeInitOptions, 'targetOrigin'>{
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