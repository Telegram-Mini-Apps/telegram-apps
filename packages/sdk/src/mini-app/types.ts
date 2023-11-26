import type { HeaderColorKey, PostEvent } from '~/bridge/index.js';
import type { RGB } from '~/colors/index.js';
import type { StateEvents } from '~/state/index.js';
import type { Version } from '~/version/index.js';

export interface MiniAppProps {
  headerColor: MiniAppHeaderColor;
  backgroundColor: RGB;
  version: Version;
  botInline: boolean;
  postEvent?: PostEvent;
}

export type MiniAppHeaderColor = HeaderColorKey | RGB;

export interface MiniAppState {
  backgroundColor: RGB;
  headerColor: MiniAppHeaderColor;
}

export type MiniAppEvents = StateEvents<MiniAppState>;

export type MiniAppEventName = keyof MiniAppEvents;

export type MiniAppEventListener<E extends MiniAppEventName> = MiniAppEvents[E];
