import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { StateEvents } from '@/classes/State/types.js';

/**
 * Viewport constructor properties.
 */
export interface ViewportProps {
  height: number;
  width: number;
  stableHeight: number;
  isExpanded: boolean;
  postEvent: PostEvent;
}

/**
 * Viewport internal state.
 */
export interface ViewportState {
  height: number;
  isExpanded: boolean;
  stableHeight: number;
  width: number;
}

/**
 * Viewport trackable events.
 */
export interface ViewportEvents extends StateEvents<ViewportState> {
}

/**
 * Viewport event name.
 */
export type ViewportEventName = keyof ViewportEvents;

/**
 * Viewport event listener.
 */
export type ViewportEventListener<E extends ViewportEventName> = ViewportEvents[E];
