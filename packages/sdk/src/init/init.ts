import { isIframe, Bridge } from '@twa.js/bridge';

import {
  BackButton,
  ClosingConfirmation,
  HapticFeedback,
  InitData, Layout,
  MainButton,
  Popup,
  QRScanner,
  ThemeParams,
  Viewport,
  WebApp,
} from '../components/index.js';
import type { InitOptions, InitResult } from './types.js';
import { BridgeScoped } from '../lib/index.js';
import { retrieveLaunchParams } from '../utils/index.js';

/**
 * Initializes all SDK components.
 * @param options - initialization options.
 */
export async function init(options: InitOptions = {}): Promise<InitResult> {
  const { checkCompat = true, acceptScrollbarStyle = true } = options;

  // Get Web App launch params.
  const {
    initData,
    version,
    platform,
    themeParams,
  } = retrieveLaunchParams();
  const {
    backgroundColor = '#ffffff',
    buttonColor = '#000000',
    buttonTextColor = '#ffffff',
  } = themeParams;

  // Create Bridge instance.
  const twaBridge = Bridge.init(options);
  const bridge = checkCompat ? new BridgeScoped(twaBridge, version) : twaBridge;

  // In case, we are currently in iframe, it is required to listen to
  // messages, coming from parent source to apply requested changes.
  // The only one case, when current application was placed into iframe is
  // web version of Telegram.
  if (acceptScrollbarStyle && isIframe()) {
    // Create special style element which is responsible for application
    // style controlled by external app.
    const styleElement = document.createElement('style');
    styleElement.id = '__tg-iframe-style__';
    document.head.appendChild(styleElement);

    // Listen to custom style changes.
    twaBridge.on('set_custom_style', (html) => {
      styleElement.innerHTML = html;
    });

    // Notify Telegram, iframe is ready. This will result in sending style
    // tag html from native application.
    twaBridge.postEvent('iframe_ready');
  }

  // Get viewport information.
  const { width, isExpanded, height, isStateStable } = platform !== 'macos'
    ? await Viewport.request(bridge)
    : {
      width: window.innerWidth,
      height: window.innerHeight,
      isStateStable: true,
      isExpanded: true,
    };

  const result: InitResult = {
    backButton: new BackButton(bridge, version),
    bridge: twaBridge,
    closingConfirmation: new ClosingConfirmation(bridge),
    haptic: new HapticFeedback(bridge, version),
    layout: new Layout(bridge, version, 'bg_color', backgroundColor),
    mainButton: new MainButton(bridge, buttonColor, buttonTextColor),
    popup: new Popup(bridge, version),
    qrScanner: new QRScanner(bridge, version),
    themeParams: ThemeParams.synced(bridge, themeParams),
    viewport: Viewport.synced(bridge, height, width, isStateStable ? height : 0, isExpanded),
    webApp: new WebApp(bridge, version, platform),
  };

  if (initData !== undefined) {
    const { authDate, hash, ...restInitData } = initData;
    result.initData = new InitData(authDate, hash, restInitData);
  }

  return result;
}
