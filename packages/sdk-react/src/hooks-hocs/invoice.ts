import { initInvoice } from '@tma.js/sdk';

import { createHOCs } from '../createHOCs.js';
import { createHooks } from '../createHooks.js';

/**
 * Hook to receive the Invoice component instance.
 */
export const [useInvoiceRaw, useInvoice] = createHooks(initInvoice);

/**
 * HOC to pass the Invoice component instance to the wrapped component.
 */
export const [withInvoiceRaw, withInvoice] = createHOCs(useInvoiceRaw, useInvoice);
