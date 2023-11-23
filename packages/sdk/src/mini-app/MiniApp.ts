import {
  type PhoneRequestedStatus,
  type PostEvent,
  postEvent as defaultPostEvent,
  request,
  type SwitchInlineQueryChatType,
  type WriteAccessRequestedStatus,
} from '~/bridge/index.js';
import {
  type ColorScheme,
  isColorDark,
  isRGB,
  type RGB,
} from '~/colors/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import {
  createSupportsFunc,
  createSupportsParamFunc,
  supports,
  type SupportsFunc,
} from '~/supports/index.js';
import { compareVersions, type Version } from '~/version/index.js';
import type { CreateRequestIdFunc, Platform } from '~/types/index.js';

import type {
  MiniAppEvents,
  MiniAppHeaderColor,
  MiniAppState,
} from './types.js';

/**
 * Provides common Mini Apps functionality not covered by other system components.
 */
export class MiniApp {
  private readonly ee = new EventEmitter<MiniAppEvents>();

  private readonly state: State<MiniAppState>;

  constructor(
    headerColor: MiniAppHeaderColor,
    backgroundColor: RGB,
    private readonly currentVersion: Version,
    private readonly currentPlatform: Platform,
    private readonly botInline: boolean,
    private readonly createRequestId: CreateRequestIdFunc,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    const isSupported = createSupportsFunc(currentVersion, {
      readTextFromClipboard: 'web_app_read_text_from_clipboard',
      requestPhoneAccess: 'web_app_request_phone',
      requestWriteAccess: 'web_app_request_write_access',
      switchInlineQuery: 'web_app_switch_inline_query',
      setHeaderColor: 'web_app_set_header_color',
      setBackgroundColor: 'web_app_set_background_color',
    });

    this.supports = (method) => {
      if (!isSupported(method)) {
        return false;
      }

      // web_app_switch_inline_query requires a Mini App to be in inline mode, that's why we
      // add 1 more check here.
      if (method === 'switchInlineQuery' && !botInline) {
        return false;
      }

      return true;
    };

    this.state = new State({ backgroundColor, headerColor }, this.ee);

    this.supportsParam = createSupportsParamFunc(currentVersion, {
      'openLink.tryInstantView': ['web_app_open_link', 'try_instant_view'],
      'setHeaderColor.color': ['web_app_set_header_color', 'color'],
    });
  }

  /**
   * Returns current application background color.
   */
  get backgroundColor(): RGB {
    return this.state.get('backgroundColor');
  }

  /**
   * Returns current application color scheme. This value is
   * computed based on the current background color.
   */
  get colorScheme(): ColorScheme {
    return isColorDark(this.backgroundColor) ? 'dark' : 'light';
  }

  /**
   * Closes the Mini App.
   */
  close(): void {
    this.postEvent('web_app_close');
  }

  /**
   * Returns current application header color.
   */
  get headerColor(): MiniAppHeaderColor {
    return this.state.get('headerColor');
  }

  /**
   * True if Mini App is currently launched in bot inline mode.
   */
  get isBotInline(): boolean {
    return this.botInline;
  }

  /**
   * Returns true if passed version is more than or equal to current
   * Mini App version.
   * @param version - compared version.
   */
  isVersionAtLeast(version: Version): boolean {
    return compareVersions(version, this.version) >= 0;
  }

  /**
   * Adds new event listener.
   */
  on = this.ee.on.bind(this.ee);

  /**
   * Opens a link in an external browser. The Mini App will not be closed.
   *
   * Note that this method can be called only in response to the user
   * interaction with the Mini App interface (e.g. click inside the Mini App
   * or on the main button).
   * @param url - URL to be opened.
   * @param tryInstantView
   */
  openLink(url: string, tryInstantView?: boolean): void {
    const formattedUrl = new URL(url, window.location.href).toString();

    // If method is not supported, we are doing it in legacy way.
    if (!supports('web_app_open_link', this.version)) {
      window.open(formattedUrl, '_blank');
      return;
    }

    // Otherwise, do it normally.
    this.postEvent('web_app_open_link', {
      url: formattedUrl,
      ...(typeof tryInstantView === 'boolean' ? { try_instant_view: tryInstantView } : {}),
    });
  }

  /**
   * Opens a Telegram link inside Telegram app. The Mini App will be closed. It expects passing
   * link in full format, with hostname "t.me".
   * @param url - URL to be opened.
   * @throws {Error} URL has not allowed hostname.
   */
  openTelegramLink(url: string): void {
    const {
      hostname,
      pathname,
      search,
    } = new URL(url, window.location.href);

    if (hostname !== 't.me') {
      throw new Error(`URL has not allowed hostname: ${hostname}. Only "t.me" is allowed`);
    }

    if (!supports('web_app_open_tg_link', this.version)) {
      window.location.href = url;
      return;
    }

    this.postEvent('web_app_open_tg_link', { path_full: pathname + search });
  }

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Returns current Mini App platform.
   */
  get platform(): Platform {
    return this.currentPlatform;
  }

  /**
   * Informs the Telegram app that the Mini App is ready to be displayed.
   *
   * It is recommended to call this method as early as possible, as soon as
   * all essential interface elements loaded. Once this method called,
   * the loading placeholder is hidden and the Mini App shown.
   *
   * If the method not called, the placeholder will be hidden only when
   * the page fully loaded.
   */
  ready(): void {
    this.postEvent('web_app_ready');
  }

  /**
   * Reads text from clipboard and returns string or null. null is returned
   * in cases:
   * - Value in clipboard is not text
   * - Access to clipboard is not allowed
   */
  readTextFromClipboard(): Promise<string | null> {
    return request(
      'web_app_read_text_from_clipboard',
      { req_id: this.createRequestId() },
      'clipboard_text_received',
      { postEvent: this.postEvent },
    ).then(({ data = null }) => data);
  }

  /**
   * Requests current user phone access.
   */
  requestPhoneAccess(): Promise<PhoneRequestedStatus> {
    return request(
      'web_app_request_phone',
      'phone_requested',
      { postEvent: this.postEvent },
    ).then((data) => data.status);
  }

  /**
   * Requests write message access to current user.
   */
  requestWriteAccess(): Promise<WriteAccessRequestedStatus> {
    return request(
      'web_app_request_write_access',
      'write_access_requested',
      { postEvent: this.postEvent },
    ).then((data) => data.status);
  }

  /**
   * A method used to send data to the bot. When this method called, a service message sent to
   * the bot containing the data of the length up to 4096 bytes, and the Mini App closed. See the
   * field `web_app_data` in the class Message.
   *
   * This method is only available for Mini Apps launched via a Keyboard button.
   * @param data - data to send to bot.
   * @throws {Error} data has incorrect size.
   */
  sendData(data: string): void {
    // Firstly, compute passed text size in bytes.
    const { size } = new Blob([data]);
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.postEvent('web_app_data_send', { data });
  }

  /**
   * Updates current application header color.
   * @param color - color key or RGB color.
   */
  setHeaderColor(color: MiniAppHeaderColor): void {
    // FIXME: Has no effect on desktop, works incorrectly on Android.
    //  Issues:
    //  https://github.com/Telegram-Mini-Apps/tma.js/issues/9
    //  https://github.com/Telegram-Mini-Apps/tma.js/issues/8
    this.postEvent('web_app_set_header_color', isRGB(color) ? { color } : { color_key: color });
    this.state.set('headerColor', color);
  }

  /**
   * Updates current application background color.
   * @param color - RGB color.
   */
  setBackgroundColor(color: RGB): void {
    // FIXME: Has no effect on desktop, works incorrectly in Android.
    //  Issues:
    //  https://github.com/Telegram-Mini-Apps/tma.js/issues/9
    //  https://github.com/Telegram-Mini-Apps/tma.js/issues/8
    this.postEvent('web_app_set_background_color', { color });
    this.state.set('backgroundColor', color);
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<
  | 'readTextFromClipboard'
  | 'requestWriteAccess'
  | 'requestPhoneAccess'
  | 'switchInlineQuery'
  | 'setHeaderColor'
  | 'setBackgroundColor'
  >;

  /**
   * Checks if specified method parameter is supported by current component.
   */
  supportsParam: SupportsFunc<'setHeaderColor.color' | 'openLink.tryInstantView'>;

  /**
   * Inserts the bot's username and the specified inline query in the current chat's input field.
   * Query may be empty, in which case only the bot's username will be inserted. The client prompts
   * the user to choose a specific chat, then opens that chat and inserts the bot's username and
   * the specified inline query in the input field.
   * @param text - text which should be inserted in the input after the current bot name. Max
   * length is 256 symbols.
   * @param chatTypes - List of chat types which could be chosen to send the message. Could be
   * empty list.
   */
  switchInlineQuery(text: string, chatTypes: SwitchInlineQueryChatType[] = []): void {
    if (!this.supports('switchInlineQuery') && !this.isBotInline) {
      throw new Error('Method is unsupported because Mini App should be launched in inline mode.');
    }
    this.postEvent('web_app_switch_inline_query', {
      query: text,
      chat_types: chatTypes,
    });
  }

  /**
   * Current Mini App version. This property is used by other components to check if
   * some functionality is available on current device.
   */
  get version(): Version {
    return this.currentVersion;
  }
}
