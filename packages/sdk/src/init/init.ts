import {
  BackButton, BackButtonProps,
  HapticFeedback, HapticFeedbackProps,
  InitData,
  MainButton, MainButtonProps, PopupProps, ViewportProps,
  WebApp, WebAppProps,
} from '../components';
import {
  isBrowserEnv,
  init as initBridge,
  InitOptions as BridgeInitOptions,
} from 'twa-bridge';
import {InitOptions, InitResult} from './types';
import {getWebAppData} from './web-app-data';
import {initPopup, initTheme, initViewport} from './components';

/**
 * Initializes all SDK components.
 * @param debug - enable debug mode.
 */
export async function init(debug?: boolean): Promise<InitResult>;

/**
 * Initializes all SDK components.
 * @param options - initialization options.
 */
export async function init(options?: InitOptions): Promise<InitResult>;

export async function init(
  debugOrOptions: boolean | InitOptions = false,
): Promise<InitResult> {
  let bridgeProps: BridgeInitOptions;
  let hapticProps: HapticFeedbackProps = {};
  let backButtonProps: BackButtonProps = {};
  let mainButtonProps: MainButtonProps = {};
  let popupProps: PopupProps = {};
  let viewportProps: ViewportProps = {};
  let webAppProps: WebAppProps = {};

  // Extract component properties.
  if (typeof debugOrOptions === 'boolean') {
    bridgeProps = {debug: debugOrOptions};
  } else {
    const {
      bridge = {}, haptic = {}, backButton = {}, mainButton = {}, popup = {},
      viewport = {}, webApp = {},
    } = debugOrOptions.props || {};
    bridgeProps = bridge;
    hapticProps = haptic;
    backButtonProps = backButton;
    mainButtonProps = mainButton;
    popupProps = popup;
    viewportProps = viewport;
    webAppProps = webApp;
  }

  const bridge = initBridge(bridgeProps);

  // In case, we are currently in iframe, it is required to listen to
  // messages, coming from parent source to apply requested changes.
  // The only one case, when current application was placed into iframe is
  // web version of Telegram.
  if (isBrowserEnv()) {
    // Create special style element which is responsible for application
    // style controlled by external app.
    const styleElement = document.createElement('style');
    styleElement.id = '__tg-iframe-style__';
    document.head.appendChild(styleElement);

    // Listen to custom style changes.
    bridge.on('set_custom_style', html => styleElement.innerHTML = html);

    // Notify Telegram, iframe is ready. This will result in sending style
    // tag html from native application.
    bridge.postEvent('iframe_ready');
  }

  const {
    initData: {authDate, hash, ...restInitData},
    version,
    platform,
    themeParams,
  } = getWebAppData();

  return {
    bridge,
    backButton: new BackButton({...backButtonProps, bridge}),
    haptic: new HapticFeedback({...hapticProps, bridge}),
    initData: new InitData(authDate, hash, restInitData),
    mainButton: new MainButton({
      color: themeParams.buttonColor,
      textColor: themeParams.buttonTextColor,
      ...mainButtonProps,
      bridge,
    }),
    popup: initPopup(bridge, popupProps),
    theme: initTheme(bridge, themeParams),
    viewport: await initViewport(bridge, platform, viewportProps),
    webApp: new WebApp(version, {
      platform,
      backgroundColor: themeParams.backgroundColor,
      ...webAppProps,
      bridge,
    }),
  };
}
