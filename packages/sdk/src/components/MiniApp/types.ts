import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { HeaderColorKey } from '@/bridge/methods/types/methods.js';
import type { StateEvents } from '@/classes/State/types.js';
import type { RGB } from '@/colors/types.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';
import type { Version } from '@/version/types.js';

/**
 * MiniApp constructor properties.
 */
export interface MiniAppProps extends MiniAppState {
  version: Version;
  botInline: boolean;
  createRequestId: CreateRequestIdFn;
  postEvent: PostEvent;
}

/**
 * MiniApp header color.
 */
export type MiniAppHeaderColor = HeaderColorKey | RGB;

/**
 * MiniApp internal state.
 */
export interface MiniAppState {
  bgColor: RGB;
  headerColor: MiniAppHeaderColor;
}

/**
 * MiniApp trackable events.
 */
export interface MiniAppEvents extends StateEvents<MiniAppState> {
}

/**
 * MiniApp event name.
 */
export type MiniAppEventName = keyof MiniAppEvents;

/**
 * MiniApp event listener.
 */
export type MiniAppEventListener<E extends MiniAppEventName> = MiniAppEvents[E];

/**
 * Requested contact information.
 */
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
