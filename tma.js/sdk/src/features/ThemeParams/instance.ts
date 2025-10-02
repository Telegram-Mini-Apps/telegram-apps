import { retrieveLaunchParamsFp, on, off } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import { ThemeParams, type ThemeParamsState } from '@/features/ThemeParams/ThemeParams.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';

/**
 * @internal
 */
export function instantiateThemeParams() {
  return new ThemeParams({
    ...pipe(
      sharedFeatureOptions(),
      withStateRestore<ThemeParamsState>('themeParams'),
    ),
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
  });
}

export const themeParams = instantiateThemeParams();
