import {EventEmitter, log, parseJsonValueAsString} from '@twa.js/utils';
import {BridgeEventName, BridgeEventsMap} from './events';
import {
  parseClipboardTextReceivedPayload,
  parseInvoiceClosedPayload,
  parsePopupClosedPayload,
  parseQrTextReceivedPayload,
  parseThemeChangedPayload,
  parseViewportChangedPayload,
} from './parsing';
import {GlobalEventEmitter} from './event-receiver';
import {postEvent} from './posting';

type Emitter = EventEmitter<BridgeEventsMap>;

interface BridgeProps {
  /**
   * Is debug mode currently enabled. Enable of this feature outputs additional
   * log messages into console.
   * @default false
   */
  debug?: boolean;

  /**
   * Origin used while posting message. This option is only used in case,
   * current environment is browser (Web version of Telegram) and could
   * be used for test purposes.
   * @default 'https://web.telegram.org'
   */
  targetOrigin?: string;

  /**
   * Event emitter to listen events from. It is allowed to leave this
   * property undefined unless some special events handling is required.
   */
  emitter?: GlobalEventEmitter;
}

/**
 * Provides special layer between parent device and current application.
 * It can send and receive events, return initial application parameters and
 * much more.
 * @see How events work: https://corefork.telegram.org/api/web-events
 */
class Bridge {
  private _boundEmitter: GlobalEventEmitter | null = null;
  private readonly targetOrigin: string;
  private readonly ee: Emitter = new EventEmitter<BridgeEventsMap>();

  constructor(props: BridgeProps = {}) {
    const {
      debug = false,
      emitter = null,
      targetOrigin = 'https://web.telegram.org',
    } = props;
    this.debug = debug;
    this.targetOrigin = targetOrigin;
    this.boundEmitter = emitter;
  }

  private get boundEmitter(): GlobalEventEmitter | null {
    return this._boundEmitter || null;
  }

  private set boundEmitter(emitter) {
    // Unbind from previous emitter.
    if (this._boundEmitter !== null) {
      this._boundEmitter.off('message', this.processEvent);
    }

    // Assign new emitter and start listening to events.
    this._boundEmitter = emitter;

    if (this._boundEmitter !== null) {
      this._boundEmitter.on('message', this.processEvent);
    }
  }

  private emit: Emitter['emit'] = (event: any, ...args: any[]) => {
    this.log('log', '[emit]', event, ...args);
    this.ee.emit(event, ...args);
  };

  private log: typeof log = (level, ...args) => {
    if (this.debug) {
      log(level, '[Bridge]', ...args);
    }
  };

  /**
   * Prepares event data before passing it to listeners. Then, calls them.
   * @param type - event name.
   * @param data - event data.
   * @throws {TypeError} Data has unexpected format for event.
   */
  private processEvent = (type: BridgeEventName | string, data: unknown): void => {
    this.log('log', '[processEvent]', type, data);

    try {
      switch (type) {
        case 'viewport_changed':
          return this.emit(type, parseViewportChangedPayload(data));

        case 'theme_changed':
          return this.emit(type, parseThemeChangedPayload(data));

        case 'popup_closed':
          // FIXME: Payloads are different on different platforms.
          //  Issue: https://github.com/Telegram-Web-Apps/twa/issues/2
          if (
            // Sent on desktop.
            data === undefined ||
            // Sent on iOS.
            data === null
          ) {
            return this.emit(type, {});
          }
          return this.emit(type, parsePopupClosedPayload(data));

        case 'set_custom_style':
          return this.emit(type, parseJsonValueAsString(data));

        case 'qr_text_received':
          return this.emit(type, parseQrTextReceivedPayload(data))

        // Events which do not require any arguments.
        case 'main_button_pressed':
        case 'back_button_pressed':
        case 'settings_button_pressed':
        case 'scan_qr_popup_closed':
          return this.emit(type);

        case 'clipboard_text_received':
          return this.emit(type, parseClipboardTextReceivedPayload(data))

        case 'invoice_closed':
          return this.emit(type, parseInvoiceClosedPayload(data));

        // All other event listeners will receive unknown type of data.
        default:
          return this.emit(type as any, data);
      }
    } catch (e) {
      this.log('error', `[processEvent] error`, e);
      throw e;
    }
  };

  /**
   * Binds to specified event emitter and listens to it "message" event.
   * @param emitter - event emitter.
   */
  bind(emitter: GlobalEventEmitter): void {
    this.boundEmitter = emitter;
  }

  /**
   * Is debug mode currently enabled. This value must be set by developer
   * himself. In case, it is enabled, additional logs will appear in console.
   */
  debug: boolean;

  /**
   * Adds new event listener.
   */
  on: Emitter['on'] = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off: Emitter['off'] = this.ee.off.bind(this.ee);

  postEvent: typeof postEvent = ((event, params, options) => {
    const {targetOrigin = this.targetOrigin, ...rest} = options || {};

    postEvent(event, params, {...rest, targetOrigin});
    this.log('log', '[postEvent]', event, params);
  }) as typeof postEvent;

  /**
   * Add listener for all events. It is triggered always, when `emit`
   * function called.
   */
  subscribe: Emitter['subscribe'] = this.ee.subscribe.bind(this.ee);

  /**
   * Removes listener added with `subscribe`.
   */
  unsubscribe: Emitter['unsubscribe'] = this.ee.unsubscribe.bind(this.ee);

  /**
   * Unbinds from currently bound event emitter.
   */
  unbind(): void {
    this.boundEmitter = null;
  }
}

export {BridgeProps, Bridge};
