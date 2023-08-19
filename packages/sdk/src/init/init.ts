import {
  isIframe,
  setDebug,
  setTargetOrigin,
  postEvent as bridgePostEvent,
  supports,
  on,
} from '@twa.js/bridge';
import { withTimeout } from '@twa.js/utils';

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
import {
  parseLaunchParams,
  retrieveLaunchParams,
  type LaunchParams,
  type ThemeParams as TwaThemeParams,
} from '../utils/index.js';
import { MethodUnsupportedError } from '../lib/index.js';
import { bindCSSVariables } from './css.js';

import type { InitOptions, InitResult } from './types.js';
import type { PostEvent } from '../types.js';

/**
 * Creates synced instance of Viewport.
 * @param postEvent
 */
function createSyncedViewport(postEvent: PostEvent = bridgePostEvent): Viewport {
  const viewport = new Viewport(
    window.innerHeight,
    window.innerWidth,
    window.innerHeight,
    true,
    postEvent,
  );
  Viewport.sync(viewport);

  return viewport;
}

/**
 * Creates synced instance of ThemeParams.
 * @param params
 */
function createSyncedThemeParams(params: TwaThemeParams): ThemeParams {
  const themeParams = new ThemeParams(params);
  ThemeParams.sync(themeParams);

  return themeParams;
}

/**
 * Represents actual init function.
 * @param options
 */
async function actualInit(options: InitOptions = {}): Promise<InitResult> {
  const {
    checkCompat = true,
    cssVars = false,
    acceptScrollbarStyle = true,
    targetOrigin,
    debug,
    launchParams: launchParamsRaw,
  } = options;

  if (typeof debug === 'boolean') {
    setDebug(debug);
  }

  if (typeof targetOrigin === 'string') {
    setTargetOrigin(targetOrigin);
  }

  // Get Web App launch params.
  let launchParams: LaunchParams;

  if (launchParamsRaw) {
    launchParams = launchParamsRaw instanceof URLSearchParams || typeof launchParamsRaw === 'string'
      ? parseLaunchParams(launchParamsRaw)
      : launchParamsRaw;
  } else {
    launchParams = retrieveLaunchParams();
  }

  const {
    initData,
    initDataRaw,
    version,
    platform,
    themeParams,
  } = launchParams;
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
      return bridgePostEvent(method, params);
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

  // MacOS version does not support requesting current viewport information
  // and theme parameters. That's why we should construct this data
  // by ourselves.
  const [viewportComponent, themeParamsComponent] = platform === 'macos'
    ? [createSyncedViewport(postEvent), createSyncedThemeParams(themeParams)]
    : await Promise.all([Viewport.synced(postEvent), ThemeParams.synced(postEvent)]);

  const result: InitResult = {
    backButton: new BackButton(version, postEvent),
    closingBehavior: new ClosingBehaviour(postEvent),
    haptic: new HapticFeedback(version, postEvent),
    mainButton: new MainButton(buttonColor, buttonTextColor, postEvent),
    popup: new Popup(version, postEvent),
    postEvent,
    qrScanner: new QRScanner(version, postEvent),
    themeParams: themeParamsComponent,
    viewport: viewportComponent,
    webApp: new WebApp(version, platform, 'bg_color', backgroundColor, postEvent),
  };

  // Init data could be missing in cae, application was launched via
  // InlineKeyboardButton.
  if (initData !== undefined) {
    const { authDate, hash, ...restInitData } = initData;
    result.initData = new InitData(authDate, hash, restInitData);
    result.initDataRaw = initDataRaw;
  }

  if (cssVars) {
    bindCSSVariables(result.webApp, result.themeParams);
  }

  return result;
}

/**
 * Initializes all SDK components.
 * @param options - initialization options.
 */
export function init(options: InitOptions = {}): Promise<InitResult> {
  return withTimeout(actualInit(options), typeof options.timeout === 'number' ? options.timeout : 1000);
}
