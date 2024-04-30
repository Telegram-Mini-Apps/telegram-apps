import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { InitData } from './InitData.js';

/**
 * @returns A new initialized instance of the `InitData` class or undefined.
 * @see InitData
 */
export const initInitData = createInitFn<InitData | undefined, 'initData'>(
  ({ initData }) => (initData ? new InitData(initData) : undefined),
);
