/* eslint-disable no-await-in-loop */
import type {
  PhoneRequestedStatus,
  WriteAccessRequestedStatus,
} from '@/bridge/events/types/payloads.js';
import { invokeCustomMethod } from '@/bridge/invokeCustomMethod.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { SwitchInlineQueryChatType } from '@/bridge/methods/types/methods.js';
import { request } from '@/bridge/request.js';
import { WithStateAndSupports } from '@/classes/with-state-and-supports/WithStateAndSupports.js';
import { isColorDark } from '@/colors/isColorDark.js';
import { isRGB } from '@/colors/isRGB.js';
import type { RGB } from '@/colors/types.js';
import { contact } from '@/components/mini-app/parsing/contact.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';
import { createSupportsParamFn } from '@/supports/createSupportsParamFn.js';
import type { SupportsFn } from '@/supports/types.js';
import { createTimeoutError } from '@/timeout/createTimeoutError.js';
import { sleep } from '@/timeout/sleep.js';
import { withTimeout } from '@/timeout/withTimeout.js';
import type { ExecuteWithTimeout } from '@/types/methods.js';

import type { MiniAppHeaderColor, MiniAppProps, MiniAppState, RequestedContact } from './types.js';

/**
 * Provides common Mini Apps functionality not covered by other system components.
 */
export class MiniApp extends WithStateAndSupports<
  MiniAppState,
  | 'requestPhoneAccess'
  | 'requestWriteAccess'
  | 'switchInlineQuery'
  | 'setHeaderColor'
  | 'setBackgroundColor'
> {
  private readonly botInline: boolean;

  private readonly postEvent: PostEvent;

  private readonly createRequestId: CreateRequestIdFn;

  private requestingPhoneAccess = false;

  private requestingWriteAccess = false;

  constructor({ postEvent, createRequestId, version, botInline, ...rest }: MiniAppProps) {
    super(rest, version, {
      requestPhoneAccess: 'web_app_request_phone',
      requestWriteAccess: 'web_app_request_write_access',
      switchInlineQuery: 'web_app_switch_inline_query',
      setHeaderColor: 'web_app_set_header_color',
      setBackgroundColor: 'web_app_set_background_color',
    });

    this.createRequestId = createRequestId;
    this.postEvent = postEvent;
    this.botInline = botInline;

    const supportsOriginal = this.supports.bind(this);
    this.supports = (method) => {
      if (!supportsOriginal(method)) {
        return false;
      }

      // web_app_switch_inline_query requires a Mini App to be in inline mode, that's why we
      // add 1 more check here.
      return method !== 'switchInlineQuery' || botInline;
    };

    this.supportsParam = createSupportsParamFn(version, {
      'setHeaderColor.color': ['web_app_set_header_color', 'color'],
    });
  }

  /**
   * Attempts to get requested contact.
   * @param timeout - request timeout.
   */
  private async getRequestedContact(
    { timeout = 10000 }: ExecuteWithTimeout = {},
  ): Promise<RequestedContact> {
    return contact().parse(
      await invokeCustomMethod(
        'getRequestedContact',
        {},
        this.createRequestId(),
        { postEvent: this.postEvent, timeout },
      ),
    );
  }

  /**
   * The Mini App background color.
   */
  get bgColor(): RGB {
    return this.get('bgColor');
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
    return this.get('headerColor');
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
    return isColorDark(this.bgColor);
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

    // We are trying to retrieve the requested contact until deadline was reached.
    return withTimeout(async () => {
      while (Date.now() < deadlineAt) {
        try {
          return await this.getRequestedContact();
        } catch (e) { /* empty */
        }

        // Sleep for some time.
        await sleep(sleepTime);

        // Increase the sleep time not to kill the backend service.
        sleepTime += 50;
      }

      throw createTimeoutError(timeout);
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
  async requestPhoneAccess(options: ExecuteWithTimeout = {}): Promise<PhoneRequestedStatus> {
    if (this.requestingPhoneAccess) {
      throw new Error('Phone access is already being requested.');
    }
    this.requestingPhoneAccess = true;

    try {
      const { status } = await request('web_app_request_phone', 'phone_requested', {
        ...options,
        postEvent: this.postEvent,
      });
      return status;
    } finally {
      this.requestingPhoneAccess = false;
    }
  }

  /**
   * Requests write message access to current user.
   * @param options - additional options.
   */
  async requestWriteAccess(options: ExecuteWithTimeout = {}): Promise<WriteAccessRequestedStatus> {
    if (this.requestingWriteAccess) {
      throw new Error('Write access is already being requested.');
    }
    this.requestingWriteAccess = true;

    try {
      const { status } = await request('web_app_request_write_access', 'write_access_requested', {
        ...options,
        postEvent: this.postEvent,
      });
      return status;
    } finally {
      this.requestingWriteAccess = false;
    }
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
    if (!size || size > 4096) {
      throw new Error(`Passed data has incorrect size: ${size}`);
    }
    this.postEvent('web_app_data_send', { data });
  }

  /**
   * Updates current Mini App header color.
   *
   * @see No effect on desktop: https://github.com/Telegram-Mini-Apps/tma.js/issues/9
   * @see Works incorrectly in Android: https://github.com/Telegram-Mini-Apps/tma.js/issues/8
   * @param color - color key or RGB color.
   */
  setHeaderColor(color: MiniAppHeaderColor): void {
    this.postEvent('web_app_set_header_color', isRGB(color) ? { color } : { color_key: color });
    this.set('headerColor', color);
  }

  /**
   * Updates current Mini App background color.
   *
   * @see No effect on desktop: https://github.com/Telegram-Mini-Apps/tma.js/issues/9
   * @see Works incorrectly in Android: https://github.com/Telegram-Mini-Apps/tma.js/issues/8
   * @param color - RGB color.
   */
  setBgColor(color: RGB): void {
    this.postEvent('web_app_set_background_color', { color });
    this.set('bgColor', color);
  }

  /**
   * Checks if specified method parameter is supported by current component.
   */
  supportsParam: SupportsFn<'setHeaderColor.color'>;

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
    this.postEvent('web_app_switch_inline_query', { query: text, chat_types: chatTypes });
  }
}
