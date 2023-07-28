import type { postEvent } from '@twa.js/bridge';
import type {
  BackButton,
  ClosingBehaviour,
  HapticFeedback,
  InitData,
  MainButton,
  Popup,
  QRScanner,
  ThemeParams,
  Viewport,
  WebApp,
} from '../components/index.js';

export interface InitResult {
  backButton: BackButton;
  closingBehavior: ClosingBehaviour;
  haptic: HapticFeedback;
  initData?: InitData;
  mainButton: MainButton;
  popup: Popup;
  postEvent: typeof postEvent;
  qrScanner: QRScanner;
  themeParams: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
}

export interface InitOptions {
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
   * Should SDK throw an error in case, unsupported by current version of
   * Web App method was called. It is highly recommended not to disable this
   * feature as long as it helps developer to find issues related to usage
   * of unsupported methods.
   * @default true
   */
  checkCompat?: boolean;

  /**
   * Enable debug mode.
   * @default false
   */
  debug?: boolean;

  /**
   * Sets new targetOrigin, used by bridge's `postEvent` function.
   * @see setTargetOrigin
   */
  targetOrigin?: string;
}
