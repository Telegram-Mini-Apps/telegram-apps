import {
  type PhoneRequestedStatus,
  type PostEvent,
  postEvent as defaultPostEvent,
  request,
  type SwitchInlineQueryChatType,
  type WriteAccessRequestedStatus,
} from '~/bridge/index.js';
import {
  isColorDark,
  isRGB,
  type RGB,
} from '~/colors/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import {
  createSupportsFunc,
  createSupportsParamFunc,
  type SupportsFunc,
} from '~/supports/index.js';

import type {
  MiniAppEvents,
  MiniAppHeaderColor, MiniAppProps,
  MiniAppState,
} from './types.js';

/**
 * Provides common Mini Apps functionality not covered by other system components.
 */
export class MiniApp {
  private readonly ee = new EventEmitter<MiniAppEvents>();

  private readonly state: State<MiniAppState>;

  private readonly botInline: boolean;

  private readonly postEvent: PostEvent;

  constructor(props: MiniAppProps) {
    const {
      postEvent = defaultPostEvent,
      headerColor,
      backgroundColor,
      version,
      botInline,
    } = props;

    const isSupported = createSupportsFunc(version, {
      requestPhoneAccess: 'web_app_request_phone',
      requestWriteAccess: 'web_app_request_write_access',
      switchInlineQuery: 'web_app_switch_inline_query',
      setHeaderColor: 'web_app_set_header_color',
      setBackgroundColor: 'web_app_set_background_color',
    });

    this.postEvent = postEvent;
    this.botInline = botInline;
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
    this.supportsParam = createSupportsParamFunc(version, {
      'setHeaderColor.color': ['web_app_set_header_color', 'color'],
    });
  }

  /**
   * The Mini App background color.
   */
  get backgroundColor(): RGB {
    return this.state.get('backgroundColor');
  }

  /**
   * Closes the Mini App.
   */
  close(): void {
    this.postEvent('web_app_close');
  }

  /**
   * The Mini App header color. Could either be a header color key or RGB color.
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
   * True if current Mini App background color recognized as dark.
   */
  get isDark(): boolean {
    return isColorDark(this.backgroundColor);
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
   * Informs the Telegram app that the Mini App is ready to be displayed.
   *
   * It is recommended to call this method as early as possible, as soon as all essential
   * interface elements loaded. Once this method called, the loading placeholder is hidden
   * and the Mini App shown.
   *
   * If the method not called, the placeholder will be hidden only when the page fully loaded.
   */
  ready(): void {
    this.postEvent('web_app_ready');
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
   * field `web_app_data` in the class [Message](https://core.telegram.org/bots/api#message).
   *
   * This method is only available for Mini Apps launched via a Keyboard button.
   * @param data - data to send to bot.
   * @throws {Error} data has incorrect size.
   */
  sendData(data: string): void {
    const { size } = new Blob([data]);
    if (size === 0 || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.postEvent('web_app_data_send', { data });
  }

  /**
   * Updates current Mini App header color.
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
   * Updates current Mini App background color.
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
  | 'requestWriteAccess'
  | 'requestPhoneAccess'
  | 'switchInlineQuery'
  | 'setHeaderColor'
  | 'setBackgroundColor'
  >;

  /**
   * Checks if specified method parameter is supported by current component.
   */
  supportsParam: SupportsFunc<'setHeaderColor.color'>;

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
}
