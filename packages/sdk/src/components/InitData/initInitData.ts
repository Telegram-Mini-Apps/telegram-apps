import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { InitData } from './InitData.js';

/**
 * @returns A new initialized instance of the `InitData` class or undefined.
 * @see InitData
 */
export const initInitData = createComponentInitFn<InitData | undefined, 'initData'>(
  ({ initData }) => (initData ? new InitData(initData) : undefined),
);
