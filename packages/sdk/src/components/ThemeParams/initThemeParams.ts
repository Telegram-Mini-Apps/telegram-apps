import { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';
import { isSSR } from '@/env/isSSR.js';
import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

/**
 * @returns A new initialized instance of the `ThemeParams` class.
 * @see ThemeParams
 */
export const initThemeParams = createComponentInitFn<
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
