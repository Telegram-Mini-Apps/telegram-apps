import {
  isIframe,
  setDebug,
  setTargetOrigin,
  on,
} from '@tma.js/bridge';
import { withTimeout } from '@tma.js/utils';
import type { LaunchParams } from '@tma.js/launch-params';
import {
  parse as parseLaunchParams,
  saveToStorage as saveLaunchParamsToStorage,
  retrieveFromStorage,
} from '@tma.js/launch-params';

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
import { retrieveLaunchParams } from '../launch-params.js';

import type { InitOptions, InitResult } from './types.js';

/**
 * Returns true in case, current session was created due to native location reload.
 */
function isNativePageReload(): boolean {
  return (
    window
      .performance
      .getEntriesByType('navigation') as PerformanceNavigationTiming[]
  ).some((entry) => entry.type === 'reload');
}

/**
 * Returns true if current page was reloaded.
 * @param launchParamsFromStorage - launch parameters from sessionStorage.
 * @param currentLaunchParams - actual launch parameters.
 */
function computePageReload(
  launchParamsFromStorage: LaunchParams | null,
  currentLaunchParams: LaunchParams,
): boolean {
  // To check if page was reloaded, we should check if previous init data hash equals to the
  // current one. Nevertheless, there are some cases, when init data is missing. For example,
  // when app was launched via KeyboardButton. In this case we try to use the native way of
  // checking if current page was reloaded (which could still return incorrect result).
  // Issue: https://github.com/Telegram-Mini-Apps/issues/issues/12
  if (!launchParamsFromStorage) {
    return false;
  }

  return launchParamsFromStorage.initData?.hash === currentLaunchParams.initData?.hash;
}

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
    launchParams: optionsLaunchParams = retrieveLaunchParams(),
  } = options;

  // Set global settings.
  if (debug) {
    setDebug(debug);
  }

  if (typeof targetOrigin === 'string') {
    setTargetOrigin(targetOrigin);
  }

  // Get Web App launch params and save them to session storage, so they will be accessible from
  // anywhere.
  const launchParamsFromStorage = retrieveFromStorage();
  const launchParams = optionsLaunchParams instanceof URLSearchParams || typeof optionsLaunchParams === 'string'
    ? parseLaunchParams(optionsLaunchParams)
    : optionsLaunchParams;

  saveLaunchParamsToStorage(launchParams);

  // Compute if page was reloaded. We will need it to decide if SDK components should be restored
  // or created from scratch.
  const isPageReload = isNativePageReload()
    || computePageReload(launchParamsFromStorage, launchParams);

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
