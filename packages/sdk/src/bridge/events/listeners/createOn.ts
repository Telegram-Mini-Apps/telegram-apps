import type {
  MiniAppsEventHasParams,
  MiniAppsEventListener,
  MiniAppsEventName,
  MiniAppsEventParams,
} from '@/bridge/events/types/index.js';
import { error, log } from '@/debug/debug.js';
import type { RemoveEventListenerFn } from '@/events/types.js';
import type { If } from '@/types/index.js';

import { singletonEmitter } from './singletonEmitter.js';

export interface OnFn<E extends MiniAppsEventName> {
  (listener: MiniAppsEventListener<E>): RemoveEventListenerFn;
}

type EventWithParams = {
  [E in MiniAppsEventName]: If<MiniAppsEventHasParams<E>, E, never>
}[MiniAppsEventName];

type EventWithoutParams = {
  [E in MiniAppsEventName]: If<MiniAppsEventHasParams<E>, never, E>
}[MiniAppsEventName];

export function createOn<E extends EventWithoutParams>(event: E): OnFn<E>;
export function createOn<E extends EventWithParams>(
  event: E,
  parser: () => { parse(value: unknown): MiniAppsEventParams<E> }
): OnFn<E>;
export function createOn<E extends MiniAppsEventName>(
  event: E,
  parser?: () => { parse(value: unknown): MiniAppsEventParams<E> },
): OnFn<E> {
  return (listener) => {
    return singletonEmitter().on('message', (eventType, eventData) => {
      if (eventType === event) {
        const message = event;

        try {
          const parsed = parser ? parser().parse(eventData) : undefined;
          log('emittedEvent', 'Emitting processed event:', eventData !== undefined
            ? { event, data: parsed }
            : { event });
          (listener as any)(parsed);
        } catch (cause) {
          error(
            null,
            `There was an error processing the "${event}" event from the Telegram application. Please, file an issue here: https://github.com/Telegram-Mini-Apps/tma.js/issues/new/choose`,
            { eventType, eventData },
            cause,
          );
        }
      }
    });
  };
}
