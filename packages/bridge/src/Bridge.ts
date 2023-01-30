import {EventEmitter, log, parseJsonValueAsString} from '@twa.js/utils';

import {
  parseClipboardTextReceivedPayload,
  parseInvoiceClosedPayload,
  parsePopupClosedPayload,
  parseQrTextReceivedPayload,
  parseThemeChangedPayload,
  parseViewportChangedPayload,
} from './parsing';
import {
  PostEmptyEventName,
  postEvent, PostEventName,
  PostEventParams,
  PostNonEmptyEventName,
} from './posting';
import {createEventsObserver, EventsObserver} from './events-observer';
import {BridgeEventName, BridgeEventsMap} from './listening';
import {defineEventsReceiver} from './events-receiver';

type Emitter = EventEmitter<BridgeEventsMap>;

export interface BridgeProps {
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
}

/**
 * Provides special layer between parent device and current application.
 * @see How events work: https://telegram-web-apps.github.io/twa/docs/category/apps-communication
 */
export class Bridge {
  /**
   * Returns instance of Bridge which is attached to passed observer.
   * @param observer - events observer.
   * @param props - props to pass to bridge constructor.
   */
  static attached(observer: EventsObserver, props: BridgeProps = {}): Bridge {
    // Create Bridge instance.
    const bridge = new Bridge(props);

    // Start listening to incoming events from observer.
    observer.on('message', bridge.processEvent);

    return bridge;
  }

  /**
   * Initializes default version of Bridge instance applying additional
   * Bridge-required lifecycle logic. It is recommended to use this function
   * instead of usual Bridge constructor to make sure, created instance will
   * work appropriately.
   * @param props - bridge properties.
   */
  static init(props: BridgeProps = {}): Bridge {
    // Define event receiver to make sure, emitter will receive events.
    defineEventsReceiver();

    return Bridge.attached(createEventsObserver(), props);
  }

  private readonly targetOrigin: string;
  private readonly ee: Emitter = new EventEmitter();

  constructor(props: BridgeProps) {
    const {debug = false, targetOrigin = 'https://web.telegram.org'} = props;
    this.debug = debug;
    this.targetOrigin = targetOrigin;
  }

  private emit: Emitter['emit'] = (event: any, ...args: any[]) => {
    this.log('log', 'Emitting event:', event, ...args);
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
    this.log('log', 'Received event from Telegram:', type, data);

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
          return this.emit(type, parseQrTextReceivedPayload(data));

        // Events which do not require any arguments.
        case 'main_button_pressed':
        case 'back_button_pressed':
        case 'settings_button_pressed':
        case 'scan_qr_popup_closed':
          return this.emit(type);

        case 'clipboard_text_received':
          return this.emit(type, parseClipboardTextReceivedPayload(data));

        case 'invoice_closed':
          return this.emit(type, parseInvoiceClosedPayload(data));

        // All other event listeners will receive unknown type of data.
        default:
          return this.emit(type as any, data);
      }
    } catch (cause) {
      this.log('error', `Error processing Telegram event:`, cause);
    }
  };

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

  /**
   * Sends event to native application which launched Web App. This function
   * accepts only events, which require arguments.
   * @param event - event name.
   * @throws {Error} Bridge could not determine current
   * environment and possible way to send event.
   */
  postEvent(event: PostEmptyEventName): void;

  /**
   * Sends event to native application which launched Web App. This function
   * accepts only events, which require arguments.
   * @param event - event name.
   * @param params - event parameters.
   * @throws {Error} Bridge could not determine current
   * environment and possible way to send event.
   */
  postEvent<E extends PostNonEmptyEventName>(
    event: E,
    params: PostEventParams<E>,
  ): void;

  postEvent(event: PostEventName, params?: any) {
    const options = {targetOrigin: this.targetOrigin};

    if (params === undefined) {
      postEvent(event as PostEmptyEventName, options);
    } else {
      postEvent(event as PostNonEmptyEventName, params, options);
    }
    this.log('log', 'Sending event to Telegram:', event, params);
  }

  /**
   * Add listener for all events. It is triggered always, when `emit`
   * function called.
   */
  subscribe: Emitter['subscribe'] = this.ee.subscribe.bind(this.ee);

  /**
   * Removes listener added with `subscribe`.
   */
  unsubscribe: Emitter['unsubscribe'] = this.ee.unsubscribe.bind(this.ee);
}
