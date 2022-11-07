import {
  defineEventReceiver,
  getGlobalEventEmitter,
  GlobalEventEmitter,
} from './event-receiver';
import {Bridge, BridgeProps} from './Bridge';

interface InitOptions extends Pick<BridgeProps, 'debug' | 'emitter'> {
  /**
   * Should global event receiving function be defined. To learn more,
   * see `defineEventReceiver` implementation.
   * @default true
   * @see defineEventReceiver
   */
  defineReceiver?: boolean;

  /**
   * @default Global event emitter which is stored in window. Bridge will
   * create its instance by itself.
   * @see getGlobalEventEmitter
   * @see BridgeProps.emitter
   */
  emitter?: GlobalEventEmitter;
}

/**
 * Initializes default version of Bridge instance applying additional
 * Bridge required lifecycle logic.
 *
 * It is recommended to use this function instead of usual Bridge
 * constructor.
 * @param options - init options.
 */
export function init(options: InitOptions = {}): Bridge {
  const {
    defineReceiver = true,
    emitter = getGlobalEventEmitter(),
    ...rest
  } = options;

  if (defineReceiver) {
    defineEventReceiver();
  }

  return new Bridge({...rest, emitter});
}