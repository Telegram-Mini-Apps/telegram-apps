import type { StateEvents } from '@/classes/with-state/types.js';

/**
 * Invoice internal state.
 */
export interface InvoiceState {
  isOpened: boolean;
}

/**
 * Invoice events.
 */
export type InvoiceEvents = StateEvents<InvoiceState>;

/**
 * Invoice event name.
 */
export type InvoiceEventName = keyof InvoiceEvents;

/**
 * Invoice event listener.
 */
export type InvoiceEventListener<E extends InvoiceEventName> = InvoiceEvents[E];
