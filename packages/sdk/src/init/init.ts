import {
  isIframe,
  setDebug,
  setTargetOrigin,
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
  Viewport,
  WebApp,
} from '../components/index.js';
import {
  parseLaunchParams,
  retrieveLaunchParams,
  type LaunchParams,
} from '../utils/index.js';
import {
  bindThemeCSSVariables,
  bindViewportCSSVariables,
  bindWebAppVariables,
} from './css.js';
import {
  createPostEvent,
  createSyncedThemeParams,
  createSyncedViewport,
  parseCSSVarsOptions,
} from './utils.js';

import type {
  InitOptions,
  InitResult,
} from './types.js';

/**
 * Represents actual init function.
 * @param options - init options.
 */
async function actualInit(options: InitOptions = {}): Promise<InitResult> {
  const {
    checkCompat = true,
    cssVars = false,
    acceptScrollbarStyle = true,
    acceptCustomStyles = acceptScrollbarStyle,
    targetOrigin,
    debug = false,
    launchParams: launchParamsRaw,
  } = options;

  // Set global debug mode.
  if (debug) {
    setDebug(debug);
  }

  // Set global target origin.
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
    themeParams: lpThemeParams,
  } = launchParams;
  const {
    backgroundColor = '#ffffff',
    buttonColor = '#000000',
    buttonTextColor = '#ffffff',
  } = lpThemeParams;

  const postEvent = createPostEvent(checkCompat, version);
  const themeParams = createSyncedThemeParams(lpThemeParams);
  const webApp = new WebApp(version, platform, 'bg_color', backgroundColor, postEvent);

  const {
    themeParams: createThemeParamsCSSVars,
    viewport: createViewportCSSVars,
    webApp: createWebAppCSSVars,
  } = parseCSSVarsOptions(cssVars);

  if (createWebAppCSSVars) {
    bindWebAppVariables(webApp, themeParams);
  }

  if (createThemeParamsCSSVars) {
    bindThemeCSSVariables(themeParams);
  }

  // MacOS version does not support requesting current viewport information. That's why we
  // should construct Viewport instance by ourselves.
  const viewport = platform === 'macos'
    ? createSyncedViewport(postEvent)
    : await Viewport.synced(postEvent);

  // Apply viewport CSS variables.
  if (createViewportCSSVars) {
    bindViewportCSSVariables(viewport);
  }

  // In case, we are currently in iframe, it is required to listen to
  // messages, coming from parent source to apply requested changes.
  // The only one case, when current application was placed into iframe is
  // web version of Telegram.
  if (acceptCustomStyles && isIframe()) {
    // Create special style element which is responsible for application
    // style controlled by external app.
    const styleElement = document.createElement('style');
    styleElement.id = 'telegram-custom-styles';
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
    themeParams,
    viewport,
    webApp,
  };

  // Init data could be missing in case, application was launched via InlineKeyboardButton.
  if (initData !== undefined) {
    const { authDate, hash, ...restInitData } = initData;
    result.initData = new InitData(authDate, hash, restInitData);
    result.initDataRaw = initDataRaw;
  }

  return result;
}

/**
 * Initializes all SDK components.
 * @param options - initialization options.
 */
export function init(options: InitOptions = {}): Promise<InitResult> {
  return withTimeout(actualInit(options), options.timeout || 1000);
}
