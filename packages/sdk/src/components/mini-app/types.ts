import type { HeaderColorKey } from '../../bridge/methods/methods.js';
import type { PostEvent } from '../../bridge/methods/postEvent.js';
import type { RGB } from '../../colors/types.js';
import type { StateEvents } from '../../state/types.js';
import type { CreateRequestIdFunc } from '../../types/request-id.js';
import type { Version } from '../../version/types.js';

export interface MiniAppProps {
  headerColor: MiniAppHeaderColor;
  backgroundColor: RGB;
  version: Version;
  botInline: boolean;
  createRequestId: CreateRequestIdFunc;
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

export interface RequestedContact {
  contact: {
    userId: number;
    phoneNumber: string;
    firstName: string;
    lastName?: string;
  };
  authDate: Date;
  hash: string;
}
