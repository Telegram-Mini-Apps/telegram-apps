import { catchCustomStyles } from './catchCustomStyles.js';
import { createBackButton } from './creators/createBackButton.js';
import { createClosingBehavior } from './creators/createClosingBehavior.js';
import { createMainButton } from './creators/createMainButton.js';
import { createMiniApp } from './creators/createMiniApp.js';
import { createRequestIdGenerator } from './creators/createRequestIdGenerator.js';
import { createSettingsButton } from './creators/createSettingsButton.js';
import { createThemeParams } from './creators/createThemeParams.js';
import { createViewport } from './creators/createViewport.js';
import { processCSSVars } from './css/processCSSVarsOption.js';
import type { InitOptions, InitResult } from './types.js';
import { on } from '../bridge/events/on.js';
import { createPostEvent } from '../bridge/methods/createPostEvent.js';
import { CloudStorage } from '../components/cloud-storage/CloudStorage.js';
import { HapticFeedback } from '../components/haptic-feedback/HapticFeedback.js';
import { InitData } from '../components/init-data/InitData.js';
import { Invoice } from '../components/invoice/Invoice.js';
import { Popup } from '../components/popup/Popup.js';
import { QRScanner } from '../components/qr-scanner/QRScanner.js';
import { Utils } from '../components/utils/Utils.js';
import { retrieveLaunchParams } from '../launch-params/retrieveLaunchParams.js';
import { isIframe } from '../misc/isIframe.js';
import { isPageReload } from '../misc/isPageReload.js';

type ComputedInitResult<O> = O extends { async: true } | { complete: true }
  ? Promise<InitResult>
  : InitResult;

export function init(): InitResult;
export function init<O extends InitOptions>(options: O): ComputedInitResult<O>;
export function init(options: InitOptions = {}): InitResult | Promise<InitResult> {
  const {
    async = false,
    complete = async,
    cssVars = false,
    acceptCustomStyles = false,
  } = options;

  try {
    const {
      initData,
      initDataRaw,
      version,
      platform,
      themeParams,
      botInline = false,
    } = retrieveLaunchParams();
    const isPageReloaded = isPageReload();

    const createRequestId = createRequestIdGenerator();
    const postEvent = createPostEvent(version);

    // In Telegram web version we should listen to special event sent from the Telegram application
    // to know, when we should reload the Mini App.
    if (isIframe()) {
      if (acceptCustomStyles) {
        catchCustomStyles();
      }

      // Notify Telegram, iframe is ready. This will result in sending style tag html from native
      // application which is used in catchCustomStyles function. We should call this method also
      // to start receiving "reload_iframe" events from the Telegram application.
      postEvent('iframe_ready', { reload_supported: true });
      on('reload_iframe', () => {
        postEvent('iframe_will_reload');
        window.location.reload();
      });
    }

    const result: Omit<InitResult, 'viewport'> = {
      backButton: createBackButton(isPageReloaded, version, postEvent),
      closingBehavior: createClosingBehavior(isPageReloaded, postEvent),
      cloudStorage: new CloudStorage(version, createRequestId, postEvent),
      createRequestId,
      hapticFeedback: new HapticFeedback(version, postEvent),
      invoice: new Invoice(version, postEvent),
      mainButton: createMainButton(
        isPageReloaded,
        themeParams.buttonColor || '#000000',
        themeParams.buttonTextColor || '#ffffff',
        postEvent,
      ),
      miniApp: createMiniApp(
        isPageReloaded,
        themeParams.backgroundColor || '#ffffff',
        version,
        botInline,
        createRequestId,
        postEvent,
      ),
      popup: new Popup(version, postEvent),
      postEvent,
      qrScanner: new QRScanner(version, postEvent),
      settingsButton: createSettingsButton(isPageReloaded, version, postEvent),
      themeParams: createThemeParams(themeParams),
      utils: new Utils(version, createRequestId, postEvent),
      ...(initData
        // Init data could be missing in case, application was launched via InlineKeyboardButton.
        ? {
          initData: new InitData(initData),
          initDataRaw,
        }
        : {}),
    };

    const viewport = createViewport(isPageReloaded, platform, postEvent, complete);
    if (viewport instanceof Promise || complete) {
      return Promise.resolve(viewport).then((vp) => {
        processCSSVars(
          cssVars,
          result.miniApp,
          result.themeParams,
          vp,
        );

        return { ...result, viewport: vp };
      });
    }

    processCSSVars(
      cssVars,
      result.miniApp,
      result.themeParams,
      viewport,
    );

    return { ...result, viewport };
  } catch (e) {
    if (complete) {
      return Promise.reject(e);
    }
    throw e;
  }
}
