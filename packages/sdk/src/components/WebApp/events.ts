import type { RGB } from '@twa.js/utils';
import type { HeaderColorKey } from '@twa.js/bridge';

export interface WebAppEvents {
  backgroundColorChanged: (color: RGB) => void;
  headerColorChanged: (color: HeaderColorKey) => void;
}

export type WebAppEventName = keyof WebAppEvents;

export type WebAppEventListener<E extends WebAppEventName> = WebAppEvents[E];
