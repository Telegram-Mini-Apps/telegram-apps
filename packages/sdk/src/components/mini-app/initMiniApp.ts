import { createInitFn } from '@/components/createInitFn.js';
import { MiniApp } from '@/components/mini-app/MiniApp.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

export const initMiniApp = createInitFn<MiniApp, 'miniApp'>(
  'miniApp',
  (options, state) => {
    const {
      bgColor = '#ffffff',
      headerBgColor: headerColor = '#000000',
    } = retrieveLaunchParams().themeParams;

    return new MiniApp({
      ...options,
      bgColor,
      headerColor,
      ...state,
      botInline: retrieveLaunchParams().botInline || false,
    });
  },
);
