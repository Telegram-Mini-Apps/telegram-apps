import {EventEmitter, parseJsonParamAsString, log} from 'twa-core';
import {
  BridgeEventName,
  BridgeEventsMap,
  BridgePostEmptyEventName,
  BridgePostEventParams,
  BridgePostEventName,
  BridgePostNonEmptyEventName,
} from './events';
import {
  extractInvoiceClosedPayload,
  extractPopupClosedPayload,
  extractThemeChangedPayload,
  extractViewportChangedPayload,
} from './parsing';
import {isBrowserEnv, isDesktopOrMobileEnv, isWindowsPhoneEnv} from './env';
import {GlobalEventEmitter} from './event-receiver';

export interface BridgeProps {
  /**
   * Is debug mode currently enabled. Enable of this feature outputs additional
   * log messages into console.
   * @default false
   */
  debug?: boolean;

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
 */
export class Bridge {
  private _boundEmitter: GlobalEventEmitter | null = null;
  private ee = new EventEmitter<BridgeEventsMap>();

  constructor(props: BridgeProps = {}) {
    const {debug = false, emitter = null} = props;
    this.debug = debug;
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

  /**
   * @see EventEmitter.emit
   */
  private emit: typeof this.ee.emit = (event: any, ...args: any[]) => {
    this.log('log', '[emit]', event, ...args);
    this.ee.emit(event, ...args);
  };

  /**
   * @see EventEmitter.emitUnsafe
   */
  private emitUnsafe: typeof this.ee.emitUnsafe = (event, ...args) => {
    this.log('log', '[emitUnsafe]', event, ...args);
    this.ee.emitUnsafe(event, ...args);
  };

  private log: typeof log = (level, ...args) => {
    if (this.debug) {
      log(level, '[Bridge]', ...args);
    }
  };

  /**
   * Prepares event data before passing it to listeners.
   * @param type - event name.
   * @param data - event data.
   * @throws {TypeError} Data has unexpected format for event.
   */
  private processEvent = (type: BridgeEventName | string, data: unknown): void => {
    this.log('log', '[processEvent]', type, data);

    try {
      switch (type) {
        case 'viewport_changed':
          return this.emit(type, extractViewportChangedPayload(data));

        case 'theme_changed':
          return this.emit(type, extractThemeChangedPayload(data));

        case 'popup_closed':
          // FIXME: Payloads are different on different platforms.
          //  Issue: https://github.com/Telegram-Web-Apps/twa/issues/2
          if (
            // Sent on desktop.
            data === undefined ||
            // Sent on iOS.
            data === null
          ) {
            return this.emit(type, {button_id: null});
          }
          return this.emit(type, extractPopupClosedPayload(data));

        case 'set_custom_style':
          return this.emit(type, parseJsonParamAsString(data));

        // Events which do not require any arguments.
        case 'main_button_pressed':
        case 'back_button_pressed':
        case 'settings_button_pressed':
          return this.emit(type);

        case 'invoice_closed':
          return this.emit(type, extractInvoiceClosedPayload(data));

        // All other event listeners will receive unknown type of data.
        default:
          return this.emitUnsafe(type, data);
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
  on = this.ee.on.bind(this.ee);

  /**
   * Removes event listener.
   */
  off = this.ee.off.bind(this.ee);

  /**
   * Sends event to native application which launched Web App. In case,
   * low-level control required, usage of this function allowed,
   * but expected behavior not guaranteed.
   *
   * This function accepts only events, which require arguments.
   *
   * @param event - event name.
   * @param params
   * @throws {Error} Bridge could not determine current
   * environment and possible way to send event.
   */
  postEvent<E extends BridgePostNonEmptyEventName>(
    event: E,
    params: BridgePostEventParams<E>,
  ): void;

  /**
   * Sends event to native application which launched Web App. In case,
   * low-level control required, usage of this function allowed,
   * but expected behavior not guaranteed.
   *
   * This function accepts only events, which require arguments.
   *
   * @param event - event name.
   * @throws {Error} Bridge could not determine current
   * environment and possible way to send event.
   */
  postEvent(event: BridgePostEmptyEventName): void;

  postEvent(event: BridgePostEventName, params: any = ''): void {
    let method: string;

    if (isBrowserEnv()) {
      window.parent.postMessage(JSON.stringify({
        eventType: event,
        eventData: params,
      }), 'https://web.telegram.org');
      method = 'window.parent.postMessage';
    } else if (isDesktopOrMobileEnv(window)) {
      window.TelegramWebviewProxy.postEvent(event, JSON.stringify(params));
      method = 'window.TelegramWebviewProxy.postEvent';
    } else if (isWindowsPhoneEnv(window)) {
      window.external.notify(JSON.stringify({
        eventType: event,
        eventData: params,
      }));
      method = 'window.external.notify';
    } else {
      // Otherwise, application is not ready to post events.
      throw new Error(
        'Bridge could not determine current environment and possible ' +
        'way to send event.',
      );
    }
    this.log('log', '[postEvent]', method, event, params);
  }

  /**
   * Add listener for all events. It is triggered always, when `emit`
   * function called.
   */
  subscribe = this.ee.subscribe.bind(this.ee);

  /**
   * Removes listener added with `subscribe`.
   */
  unsubscribe = this.ee.unsubscribe.bind(this.ee);

  /**
   * Unbinds from currently bound event emitter.
   */
  unbind(): void {
    this.boundEmitter = null;
  }
}
