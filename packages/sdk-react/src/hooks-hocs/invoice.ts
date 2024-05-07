import { initInvoice } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the Invoice component instance.
 */
export const useInvoice: Hook<typeof initInvoice> = createHook(initInvoice);

/**
 * HOC to pass the Invoice component instance to the wrapped component.
 */
export const withInvoice: HOC<'invoice', typeof useInvoice> = createHOC('invoice', useInvoice);
