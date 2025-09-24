import { isTMAFp, retrieveLaunchParamsFp, on, off } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import { ThemeParams } from '@/features/ThemeParams/ThemeParams.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { version } from '@/globals/version.js';
import { isPageReload } from '@/navigation.js';

export const themeParams = new ThemeParams({
  isPageReload,
  isTma: isTMAFp,
  offThemeChanged(listener) {
    off('theme_changed', listener);
  },
  onThemeChanged(listener) {
    on('theme_changed', listener);
  },
  retrieveThemeParams() {
    return pipe(
      retrieveLaunchParamsFp(),
      E.map(lp => lp.tgWebAppThemeParams),
    );
  },
  storage: createComponentSessionStorage('themeParams'),
  version,
});
