import {
  boolean,
  createTransformerGen,
  number,
  object,
  string,
  type TransformerGen,
} from '@telegram-apps/transformers';

import type { EventName, EventPayload } from '@/events/types/events.js';

/**
 * Transformers for problematic Mini Apps events.
 */
export const transformers: { [E in EventName]?: TransformerGen<EventPayload<E>> } = {
  clipboard_text_received: object({
    req_id: string(),
    data: (value) => (value === null ? value : string(true)(value)),
  }, 'clipboard_text_received'),
  custom_method_invoked: object({
    req_id: string(),
    result: (value) => value,
    error: string(true),
  }, 'custom_method_invoked'),
  popup_closed: createTransformerGen('popup_closed', value => {
    return value
      ? object({
        button_id: (value) => (
          value === null || value === undefined ? undefined : string()(value)
        ),
      })()(value)
      : {};
  }),
  viewport_changed: object({
    height: number(),
    width: (value) => (
      value === null || value === undefined
        ? window.innerWidth
        : number()(value)
    ),
    is_state_stable: boolean(),
    is_expanded: boolean(),
  }, 'viewport_changed'),
};