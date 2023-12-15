import { createPostEvent, isIframe, on } from '~/bridge/index.js';
import { CloudStorage } from '~/cloud-storage/index.js';
import { HapticFeedback } from '~/haptic-feedback/index.js';
import { catchCustomStyles } from '~/init/catchCustomStyles.js';
import {
  createBackButton,
  createClosingBehavior,
  createMainButton,
  createMiniApp,
  createRequestIdGenerator, createSettingsButton,
  createThemeParams, createViewportAsync,
  createViewportSync,
} from '~/init/creators/index.js';
import { processCSSVars } from '~/init/css/index.js';
import { InitData } from '~/init-data/index.js';
import { Invoice } from '~/invoice/index.js';
import { retrieveLaunchData } from '~/launch-params/index.js';
import { Popup } from '~/popup/index.js';
import { QRScanner } from '~/qr-scanner/index.js';
import { Utils } from '~/utils/index.js';

import type { InitOptions, InitResult } from './types.js';

type ComputedInitResult<O> = O extends { async: true } ? Promise<InitResult> : InitResult;

export function init(): InitResult;
export function init<O extends InitOptions>(options: O): ComputedInitResult<O>;
export function init(options: InitOptions = {}): InitResult | Promise<InitResult> {
  const {
    async = false,
    cssVars = false,
    acceptCustomStyles = false,
  } = options;

  try {
    // Retrieve launch data.
    const {
      launchParams: {
        initData,
        initDataRaw,
        version,
        platform,
        themeParams,
        botInline = false,
      },
      isPageReload,
    } = retrieveLaunchData();

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
      on('reload_iframe', () => window.location.reload());
    }

    const result: Omit<InitResult, 'viewport'> = {
      backButton: createBackButton(isPageReload, version, postEvent),
      closingBehavior: createClosingBehavior(isPageReload, postEvent),
      cloudStorage: new CloudStorage(version, createRequestId, postEvent),
      createRequestId,
      hapticFeedback: new HapticFeedback(version, postEvent),
      invoice: new Invoice(version, postEvent),
      mainButton: createMainButton(
        isPageReload,
        themeParams.buttonColor || '#000000',
        themeParams.buttonTextColor || '#ffffff',
        postEvent,
      ),
      miniApp: createMiniApp(
        isPageReload,
        themeParams.backgroundColor || '#ffffff',
        version,
        botInline,
        createRequestId,
        postEvent,
      ),
      popup: new Popup(version, postEvent),
      postEvent,
      qrScanner: new QRScanner(version, postEvent),
      settingsButton: createSettingsButton(isPageReload, version, postEvent),
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

    const viewport = async
      ? createViewportAsync(isPageReload, platform, postEvent)
      : createViewportSync(isPageReload, platform, postEvent);

    if (viewport instanceof Promise) {
      return viewport.then((vp) => {
        processCSSVars(
          cssVars,
          result.miniApp,
          result.themeParams,
          vp,
        );

        return {
          ...result,
          viewport: vp,
        };
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
    if (async) {
      return Promise.reject(e);
    }
    throw e;
  }
}
