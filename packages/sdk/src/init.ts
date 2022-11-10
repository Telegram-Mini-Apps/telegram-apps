import {
  BackButton,
  HapticFeedback,
  InitData, isDesktop, MainButton, Platform, Popup,
  ThemeParams,
  Viewport, WebApp,
} from './components';
import {
  extractThemeFromJson,
  ThemeParams as TwaThemeParams,
} from 'twa-theme-params';
import {Bridge, isBrowserEnv, init as initBridge} from 'twa-bridge';
import {
  createSearchParamsStructParser,
  parseSearchParamAsString, Version,
} from 'twa-core';
import {extractInitDataFromSearchParams} from 'twa-init-data';

interface InitResult {
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

const extractWebAppData = createSearchParamsStructParser({
  version: ['tgWebAppVersion', parseSearchParamAsString],
  initData: ['tgWebAppData', extractInitDataFromSearchParams],
  platform: ['tgWebAppPlatform', parseSearchParamAsString],
  themeParams: ['tgWebAppThemeParams', extractThemeFromJson],
});

/**
 * Initializes ThemeParams instance.
 * @param bridge - Bridge instance.
 * @param themeParams - theme parameters.
 */
function initTheme(bridge: Bridge, themeParams: TwaThemeParams): ThemeParams {
  // Create ThemeParams instance.
  const theme = new ThemeParams(themeParams);

  // Track external theme changes.
  bridge.on('theme_changed', ({theme_params}) => {
    theme.update(extractThemeFromJson(theme_params));
  });

  return theme;
}

/**
 * Initializes Viewport instance.
 * @param bridge - Bridge instance.
 * @param platform - platform name.
 */
async function initViewport(bridge: Bridge, platform: Platform): Promise<Viewport> {
  // Get current viewport information.
  const {height, is_state_stable, width, is_expanded} = isDesktop(platform)
    // TODO: In desktop version, method web_app_request_viewport
    //  does not work.
    //  Issue: https://github.com/Telegram-Web-Apps/client-sdk/issues/7
    ? {
      width: window.innerWidth,
      height: window.innerHeight,
      is_state_stable: true,
      is_expanded: true,
    }
    : await Viewport.request(bridge);

  // Create Viewport instance.
  const viewport = new Viewport({
    bridge,
    height,
    width,
    isExpanded: is_expanded,
    stableHeight: is_state_stable ? height : 0,
  });

  // Listen to viewport change event.
  bridge.on('viewport_changed', payload => {
    const {height, is_state_stable, width, is_expanded} = payload;
    viewport.update({
      height,
      width,
      isStateStable: is_state_stable,
      isExpanded: is_expanded,
    });
  });

  return viewport;
}

/**
 * Initializes Popup instance.
 * @param bridge - Bridge instance.
 * @param version - Web App version.
 */
function initPopup(bridge: Bridge, version: Version): Popup {
  const popup = new Popup(version, {bridge});

  // Track global popup close event.
  bridge.on('popup_closed', () => popup.hide());

  return popup;
}

/**
 * Initializes all SDK components.
 * @param debug - should debug mode be enabled.
 */
export async function init(debug = false): Promise<InitResult> {
  const searchParams = window.location.hash.slice(1);

  // Create bridge.
  const bridge = initBridge({debug});

  // Extract WebApp data.
  const {
    initData: {authDate, hash, ...restInitData},
    version,
    platform,
    themeParams,
  } = extractWebAppData(searchParams);

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

  return {
    bridge,
    backButton: new BackButton(version, {bridge}),
    haptic: new HapticFeedback(version, {bridge}),
    initData: new InitData(authDate, hash, restInitData),
    mainButton: new MainButton({
      bridge,
      color: themeParams.buttonColor,
      textColor: themeParams.buttonTextColor,
    }),
    popup: initPopup(bridge, version),
    theme: initTheme(bridge, themeParams),
    viewport: await initViewport(bridge, platform),
    webApp: new WebApp(version, {
      bridge,
      platform,
      backgroundColor: themeParams.backgroundColor,
    }),
  };
}
