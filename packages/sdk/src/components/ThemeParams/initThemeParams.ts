import { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';
import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';
import { isSSR } from '@/env/isSSR.js';

/**
 * @returns A new initialized instance of the `ThemeParams` class.
 * @see ThemeParams
 */
export const initThemeParams = createInitFn<
  'themeParams',
  ThemeParams,
  'themeParams'
>('themeParams', ({ themeParams, state = themeParams }) => {
  const tp = new ThemeParams(state);

  if (!isSSR()) {
    tp.listen();
  }

  return tp;
});
