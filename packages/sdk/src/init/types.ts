import {
  BackButton, BackButtonProps,
  HapticFeedback, HapticFeedbackProps,
  InitData,
  MainButton, MainButtonProps,
  Popup, PopupProps, ThemeParams, Viewport, ViewportProps, WebApp, WebAppProps,
} from '../components';
import {Bridge, InitOptions as BridgeInitOptions} from 'twa-bridge';

type RemoveBridge<T> = Omit<T, 'bridge'>;

export interface InitResult {
  backButton: BackButton;
  bridge: Bridge;
  haptic: HapticFeedback;
  initData: InitData;
  mainButton: MainButton;
  popup: Popup;
  theme: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
}

export interface InitOptions {
  /**
   * Properties which are passed to components constructors.
   */
  props?: {
    bridge?: BridgeInitOptions;
    backButton?: RemoveBridge<BackButtonProps>;
    haptic?: RemoveBridge<HapticFeedbackProps>;
    mainButton?: RemoveBridge<MainButtonProps>;
    popup?: RemoveBridge<PopupProps>;
    viewport?: RemoveBridge<ViewportProps>;
    webApp?: RemoveBridge<WebAppProps>;
  };
}