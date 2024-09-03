import type { EventPayload } from '@telegram-apps/bridge';

import type { State } from './types.js';

/**
 * Converts `biometry_info_received` to some common shape.
 * @param event - event payload.
 * @see biometry_info_received
 */
export function eventToState(event: EventPayload<'biometry_info_received'>): State {
  return event.available ? {
    available: true,
    tokenSaved: event.token_saved,
    deviceId: event.device_id,
    accessRequested: event.access_requested,
    type: event.type,
    accessGranted: event.access_granted,
  } : {
    available: false,
  };
}
