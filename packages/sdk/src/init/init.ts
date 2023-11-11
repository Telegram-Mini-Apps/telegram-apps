import {
  isIframe,
  setDebug,
  setTargetOrigin,
  on,
} from '@tma.js/bridge';
import { withTimeout } from '@tma.js/utils';
import { parse, retrieveLaunchData } from '@tma.js/launch-params';

import {
  CloudStorage,
  HapticFeedback,
  InitData,
  Popup,
  QRScanner,
} from '../components/index.js';
import {
  bindThemeCSSVariables,
  bindViewportCSSVariables,
  bindWebAppVariables,
  parseCSSVarsOptions,
} from './css.js';
import {
  createPostEvent,
  createThemeParams,
  createBackButton,
  createMainButton,
  createViewport,
  createWebApp, createRequestIdGenerator, createClosingBehavior,
} from './creators/index.js';

import type { InitOptions, InitResult } from './types.js';

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
    launchParams: launchParamsOption,
    debug = false,
  } = options;

  // Set global settings.
  if (debug) {
    setDebug(debug);
  }

  if (typeof targetOrigin === 'string') {
    setTargetOrigin(targetOrigin);
  }

  // Retrieve launch data.
  const { launchParams, isPageReload } = retrieveLaunchData({
    currentLaunchParams: typeof launchParamsOption === 'string' || launchParamsOption instanceof URLSearchParams
      ? parse(launchParamsOption)
      : launchParamsOption,
  });

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

  const createRequestId = createRequestIdGenerator();
  const postEvent = createPostEvent(checkCompat, version);
  const themeParams = createThemeParams(lpThemeParams);
  const webApp = createWebApp(
    isPageReload,
    backgroundColor,
    version,
    platform,
    createRequestId,
    postEvent,
  );

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

  const viewport = await createViewport(isPageReload, platform, postEvent);

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
    backButton: createBackButton(isPageReload, version, postEvent),
    closingBehavior: createClosingBehavior(isPageReload, postEvent),
    cloudStorage: new CloudStorage(version, createRequestId, postEvent),
    haptic: new HapticFeedback(version, postEvent),
    mainButton: createMainButton(isPageReload, buttonColor, buttonTextColor, postEvent),
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
