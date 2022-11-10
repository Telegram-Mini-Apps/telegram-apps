import {ColorScheme, Platform, SettableColorKey} from './types';
import {
  createSupportChecker,
  formatURL,
  processBridgeProp,
  SupportChecker,
} from '../../utils';
import {
  EventEmitter,
  RGBColor,
  isColorDark,
  toRGB,
  Version,
  compareVersions,
} from 'twa-core';
import {WebAppEventsMap} from './events';
import {Bridge, isBrowserEnv, supports} from 'twa-bridge';
import {isDesktop, isWeb} from './utils';
import {WithCommonProps} from '../../types';

export interface WebAppProps extends WithCommonProps {
  backgroundColor?: RGBColor;
  headerColor?: SettableColorKey;
  isClosingConfirmationEnabled?: boolean;
  platform?: Platform;
}

type SupportsFunc = SupportChecker<'disableClosingConfirmation' | 'enableClosingConfirmation' | 'setBackgroundColor'>;

/**
 * Provides functionality which is recognized as common for Web Apps. In other
 * words, this class mostly contains utilities.
 */
export class WebApp {
  private readonly ee = new EventEmitter<WebAppEventsMap>();
  private readonly bridge: Bridge;
  private _backgroundColor: RGBColor;
  private _headerColor: SettableColorKey;
  private _isClosingConfirmationEnabled: boolean;

  constructor(version: Version, props: WebAppProps = {}) {
    const {
      bridge,
      headerColor = 'bg_color',
      backgroundColor = '#ffffff',
      isClosingConfirmationEnabled = false,
      platform = 'unknown',
    } = props;
    this.bridge = processBridgeProp(bridge);
    this.supports = createSupportChecker(version, {
      disableClosingConfirmation: 'web_app_setup_closing_behavior',
      enableClosingConfirmation: 'web_app_setup_closing_behavior',
      setBackgroundColor: 'web_app_set_background_color',
    });
    this.version = version;
    this.platform = platform;
    this._backgroundColor = toRGB(backgroundColor);
    this._headerColor = headerColor;
    this._isClosingConfirmationEnabled = isClosingConfirmationEnabled;
  }

  /**
   * Current native application background color.
   */
  get backgroundColor(): RGBColor {
    return this._backgroundColor;
  }

  /**
   * Closes Web App.
   */
  close(): void {
    this.bridge.postEvent('web_app_close');
  }

  /**
   * Returns current application color scheme. This value is computed according
   * to current background color.
   */
  get colorScheme(): ColorScheme {
    return isColorDark(this.backgroundColor) ? 'dark' : 'light';
  }

  /**
   * Disables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  disableClosingConfirmation(): void {
    this.isClosingConfirmationEnabled = false;
  }

  /**
   * Enables the confirmation dialog while the user is trying to close the
   * Web App.
   */
  enableClosingConfirmation(): void {
    this.isClosingConfirmationEnabled = true;
  }

  /**
   * Current native application header color key.
   */
  get headerColor(): SettableColorKey {
    return this._headerColor;
  }

  private set isClosingConfirmationEnabled(value: boolean) {
    // Send request to native app.
    this.bridge.postEvent('web_app_setup_closing_behavior', {
      need_confirmation: value,
    });

    if (this._isClosingConfirmationEnabled === value) {
      return;
    }

    // Update current value.
    this._isClosingConfirmationEnabled = value;

    // Emit event.
    this.ee.emit('closingConfirmationChange', value);
  }

  /**
   * `true`, if the confirmation dialog enabled while the user is trying to
   * close the Web App.
   */
  get isClosingConfirmationEnabled(): boolean {
    return this._isClosingConfirmationEnabled;
  }

  /**
   * Return `true` in case, passed version is more than or equal to current
   * Web App version.
   * @param version - compared version.
   */
  isVersionAtLeast(version: Version): boolean {
    return compareVersions(version, this.version) >= 0;
  }

  /**
   * Returns true in case, current platform is desktop.
   */
  get isDesktop(): boolean {
    return isDesktop(this.platform);
  }

  /**
   * Returns true in case, current platform is browser.
   */
  get isWeb(): boolean {
    return isWeb(this.platform);
  }

  /**
   * Opens a link in an external browser. The Web App will not be closed.
   *
   * Note that this method can be called only in response to the user
   * interaction with the Web App interface (e.g. click inside the Web App
   * or on the main button).
   * @param url - URL to be opened.
   */
  openLink(url: string): void {
    url = formatURL(url);

    // In case, current version is 6.1+, open link with special native
    // application event.
    if (supports('web_app_open_link', this.version)) {
      return this.bridge.postEvent('web_app_open_link', {url});
    }
    // Otherwise, do it in legacy way.
    window.open(url, '_blank');
  }

  /**
   * Opens a telegram link inside Telegram app. The Web App will be closed.
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   */
  openTelegramLink(url: string): void {
    const {hostname, pathname, search} = new URL(formatURL(url));

    // We allow opening links with the only 1 hostname.
    if (hostname !== 't.me') {
      throw new Error(
        `URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`,
      );
    }

    // In case, current version is 6.1+ or we are currently in iframe, open
    // link with special native application event.
    if (isBrowserEnv() || supports('web_app_open_tg_link', this.version)) {
      return this.bridge.postEvent('web_app_open_tg_link', {
        path_full: pathname + search,
      });
    }
    // Otherwise, do it in legacy way.
    window.location.href = url;
  }

  /**
   * TODO: Check docs.
   * FIXME: Implement
   * Opens an invoice using the link url.
   * @since Bot API 6.1+
   * @param url
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openInvoice(url: string): void {
    throw new Error('not implemented');
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Current Web App platform.
   */
  platform: Platform;

  /**
   * Informs the Telegram app that the Web App is ready to be displayed.
   *
   * It is recommended to call this method as early as possible, as soon as
   * all essential interface elements loaded. Once this method called,
   * the loading placeholder is hidden and the Web App shown.
   *
   * If the method not called, the placeholder will be hidden only when
   * the page fully loaded.
   */
  ready(): void {
    this.bridge.postEvent('web_app_ready');
  }

  /**
   * A method used to send data to the bot. When this method called, a
   * service message sent to the bot containing the data of the
   * length up to 4096 bytes, and the Web App closed. See the field
   * `web_app_data` in the class Message.
   *
   * This method is only available for Web Apps launched via a Keyboard button.
   * @param data - data to send to bot.
   * @throws {Error} data has incorrect size.
   */
  sendData(data: string): void {
    // Firstly, compute passed text size in bytes.
    const size = new Blob([data]).size;
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.bridge.postEvent('web_app_data_send', {data});
  }

  /**
   * Updates current application background color.
   * FIXME: Has no effect on desktop, works incorrectly in Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa/issues/9
   *  https://github.com/Telegram-Web-Apps/twa/issues/8
   * @param color - settable color key or color description in known RGB
   * format.
   * @since Web App version 6.1+
   */
  setBackgroundColor(color: RGBColor): void {
    // Convert passed value to expected `#RRGGBB` format.
    color = toRGB(color);

    // Notify native application about updating current background color.
    this.bridge.postEvent('web_app_set_background_color', {color});

    // Don't do anything in case, color is the same.
    if (this._backgroundColor === color) {
      return;
    }

    // Override current background color key.
    this._backgroundColor = color;

    // Emit event.
    this.ee.emit('backgroundColorChange', color);
  }

  /**
   * Updates current application header color.
   * FIXME: Has no effect on desktop, works incorrectly on Android.
   *  Issues:
   *  https://github.com/Telegram-Web-Apps/twa/issues/9
   *  https://github.com/Telegram-Web-Apps/twa/issues/8
   * @param color - settable color key.
   * @since Web App version 6.1+
   */
  setHeaderColor(color: SettableColorKey): void {
    // Notify native application about updating current header color.
    this.bridge.postEvent('web_app_set_header_color', {color_key: color});

    // Don't do anything in case, color is the same.
    if (this._headerColor === color) {
      return;
    }

    // Override current header color key.
    this._headerColor = color;

    // Emit event.
    this.ee.emit('headerColorChange', color);
  }

  /**
   * Returns true in case, specified method is supported by WebApp.
   */
  supports: SupportsFunc;

  /**
   * Current Web App version. This property is used by other components to check if
   * some functionality is available on current device.
   */
  version: Version;
}