import type { PostEvent } from '../../bridge/methods/postEvent.js';
import type { StateEvents } from '../../state/types.js';

export interface ViewportProps {
  height: number;
  width: number;
  stableHeight: number;
  isExpanded: boolean;
  postEvent?: PostEvent;
}

export interface ViewportState {
  height: number;
  isExpanded: boolean;
  stableHeight: number;
  width: number;
}

export type ViewportEvents = StateEvents<ViewportState>;

export type ViewportEventName = keyof ViewportEvents;

export type ViewportEventListener<E extends ViewportEventName> = ViewportEvents[E];
