import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve Invoice component.
 */
export const useInvoice = createHook('invoice', true);

/**
 * HOC to wrap specified component to pass Invoice instance.
 */
export const withInvoice = createHoc('invoice', useInvoice);
