import { contactParser } from './contactParser.js';
import type {
  MiniAppEvents,
  MiniAppHeaderColor, MiniAppProps,
  MiniAppState, RequestedContact,
} from './types.js';
import type { PhoneRequestedStatus } from '../../bridge/events/parsers/phoneRequested.js';
import type { WriteAccessRequestedStatus } from '../../bridge/events/parsers/writeAccessRequested.js';
import { invokeCustomMethod } from '../../bridge/invokeCustomMethod.js';
import type { SwitchInlineQueryChatType } from '../../bridge/methods/methods.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import { postEvent as defaultPostEvent } from '../../bridge/methods/postEvent.js';
import { request } from '../../bridge/request.js';
import { isColorDark } from '../../colors/isColorDark.js';
import { isRGB } from '../../colors/isRGB.js';
import type { RGB } from '../../colors/types.js';
import { EventEmitter } from '../../event-emitter/EventEmitter.js';
import { State } from '../../state/State.js';
import { createSupportsFunc } from '../../supports/createSupportsFunc.js';
import { createSupportsParamFunc } from '../../supports/createSupportsParamFunc.js';
import type { SupportsFunc } from '../../supports/types.js';
import { sleep } from '../../timeout/sleep.js';
import { withTimeout } from '../../timeout/withTimeout.js';
import type { ExecuteWithTimeout } from '../../types/methods.js';
import type { CreateRequestIdFunc } from '../../types/request-id.js';

type Emitter = EventEmitter<MiniAppEvents>;

/**
 * Provides common Mini Apps functionality not covered by other system components.
 */
export class MiniApp {
  private readonly ee = new EventEmitter<MiniAppEvents>();

  private readonly state: State<MiniAppState>;

  private readonly botInline: boolean;

  private readonly postEvent: PostEvent;

  private readonly createRequestId: CreateRequestIdFunc;

  private requestingPhoneAccess = false;

  private requestingWriteAccess = false;

  constructor(props: MiniAppProps) {
    const {
      postEvent = defaultPostEvent,
      headerColor,
      backgroundColor,
      version,
      botInline,
      createRequestId,
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
    this.createRequestId = createRequestId;
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
   * Attempts to get requested contact.
   */
  private async getRequestedContact(): Promise<RequestedContact> {
    return invokeCustomMethod(
      'getRequestedContact',
      {},
      this.createRequestId(),
      {
        postEvent: this.postEvent,
        timeout: 10000,
      },
    )
      .then((data) => contactParser.parse(data));
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
   * True if phone access is currently being requested.
   */
  get isRequestingPhoneAccess(): boolean {
    return this.requestingPhoneAccess;
  }

  /**
   * True if write access is currently being requested.
   */
  get isRequestingWriteAccess(): boolean {
    return this.requestingWriteAccess;
  }

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = this.ee.off.bind(this.ee);

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
   * Requests current user contact information. In contrary to requestPhoneAccess, this method
   * returns promise with contact information that rejects in case, user denied access, or request
   * failed.
   * @param options - additional options.
   */
  async requestContact({ timeout = 5000 }: ExecuteWithTimeout = {}): Promise<RequestedContact> {
    // First of all, let's try to get the requested contact. Probably, we already requested
    // it before.
    try {
      return await this.getRequestedContact();
    } catch (e) { /* empty */
    }

    // Then, request access to user's phone.
    const status = await this.requestPhoneAccess();
    if (status !== 'sent') {
      throw new Error('Access denied.');
    }

    // Expected deadline.
    const deadlineAt = Date.now() + timeout;

    // Time to wait before executing the next request.
    let sleepTime = 50;

    return withTimeout(async () => {
      // We are trying to retrieve the requested contact until deadline was reached.
      while (Date.now() < deadlineAt) {
        try {
          // eslint-disable-next-line no-await-in-loop
          return await this.getRequestedContact();
        } catch (e) { /* empty */
        }

        // Sleep for some time.
        // eslint-disable-next-line no-await-in-loop
        await sleep(sleepTime);

        // Increase the sleep time not to kill the backend service.
        sleepTime += 50;
      }

      throw new Error('Unable to retrieve requested contact.');
    }, timeout);
  }

  /**
   * Requests current user phone access. Method returns promise, which resolves
   * status of the request. In case, user accepted the request, Mini App bot will receive
   * the according notification.
   *
   * To obtain the retrieved information instead, utilize the requestContact method.
   * @param options - additional options.
   * @see requestContact
   */
  requestPhoneAccess(options: ExecuteWithTimeout = {}): Promise<PhoneRequestedStatus> {
    if (this.requestingPhoneAccess) {
      throw new Error('Phone access is already being requested.');
    }
    this.requestingPhoneAccess = true;

    return request('web_app_request_phone', 'phone_requested', {
      ...options,
      postEvent: this.postEvent,
    })
      .then((data) => data.status)
      .finally(() => {
        this.requestingPhoneAccess = false;
      });
  }

  /**
   * Requests write message access to current user.
   * @param options - additional options.
   */
  requestWriteAccess(options: ExecuteWithTimeout = {}): Promise<WriteAccessRequestedStatus> {
    if (this.requestingWriteAccess) {
      throw new Error('Write access is already being requested.');
    }
    this.requestingWriteAccess = true;

    return request('web_app_request_write_access', 'write_access_requested', {
      ...options,
      postEvent: this.postEvent,
    })
      .then((data) => data.status)
      .finally(() => {
        this.requestingWriteAccess = false;
      });
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
