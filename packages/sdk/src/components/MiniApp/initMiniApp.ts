import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { MiniApp } from './MiniApp.js';

/**
 * @returns A new initialized instance of the `MiniApp` class.
 * @see MiniApp
 */
export const initMiniApp = createInitFn<'miniApp', MiniApp, 'themeParams' | 'version' | 'botInline'>('miniApp', ({
  themeParams,
  botInline = false,
  state = {
    bgColor: themeParams.bgColor || '#ffffff',
    headerColor: themeParams.headerBgColor || '#000000',
  },
  ...rest
}) => new MiniApp({ ...rest, ...state, botInline }));
