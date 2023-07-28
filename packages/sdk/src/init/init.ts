import {
  isIframe,
  setDebug,
  setTargetOrigin,
  postEvent as bridgePostEvent,
  supports,
  on,
} from '@twa.js/bridge';

import {
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
import type { InitOptions, InitResult } from './types.js';
import { retrieveLaunchParams } from '../utils/index.js';
import { MethodUnsupportedError } from '../lib/index.js';

/**
 * Initializes all SDK components.
 * @param options - initialization options.
 */
export async function init(options: InitOptions = {}): Promise<InitResult> {
  const {
    checkCompat = true,
    acceptScrollbarStyle = true,
    targetOrigin,
    debug,
  } = options;

  if (typeof debug === 'boolean') {
    setDebug(debug);
  }

  if (typeof targetOrigin === 'string') {
    setTargetOrigin(targetOrigin);
  }

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

  // Wire postEvent if check compatibility is required.
  const postEvent: typeof bridgePostEvent = checkCompat
    ? (method: any, params?: any) => {
      if (!supports(method, version)) {
        throw new MethodUnsupportedError(method, version);
      }
      return postEvent(method, params);
    }
    : bridgePostEvent;

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
    on('set_custom_style', (html) => {
      styleElement.innerHTML = html;
    });

    // Notify Telegram, iframe is ready. This will result in sending style
    // tag html from native application.
    postEvent('iframe_ready');
  }

  const result: InitResult = {
    backButton: new BackButton(version, postEvent),
    closingBehavior: new ClosingBehaviour(postEvent),
    haptic: new HapticFeedback(version, postEvent),
    mainButton: new MainButton(buttonColor, buttonTextColor, postEvent),
    popup: new Popup(version, postEvent),
    postEvent,
    qrScanner: new QRScanner(version, postEvent),
    themeParams: await ThemeParams.synced(postEvent),
    viewport: platform === 'macos'
      // MacOS version does not support requesting current viewport
      // information used in Viewport.synced().
      ? new Viewport(window.innerHeight, window.innerWidth, window.innerHeight, true, postEvent)
      : await Viewport.synced(postEvent),
    webApp: new WebApp(version, platform, 'bg_color', backgroundColor, postEvent),
  };

  // Init data could be missing in cae, application was launched via
  // InlineKeyboardButton.
  if (initData !== undefined) {
    const { authDate, hash, ...restInitData } = initData;
    result.initData = new InitData(authDate, hash, restInitData);
  }

  return result;
}
