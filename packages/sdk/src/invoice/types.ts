import type { StateEvents } from '~/state/index.js';

export interface InvoiceState {
  isOpened: boolean;
}

export type InvoiceEvents = StateEvents<InvoiceState>;

export type InvoiceEventName = keyof InvoiceEvents;

export type InvoiceEventListener<E extends InvoiceEventName> = InvoiceEvents[E];
