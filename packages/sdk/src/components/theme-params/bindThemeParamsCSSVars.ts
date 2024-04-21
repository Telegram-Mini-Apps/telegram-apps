import { setCSSVar } from '@/css-vars/setCSSVar.js';

import type { ThemeParams } from './ThemeParams.js';

/**
 * Creates CSS variables connected with the passed instance of ThemeParams. Created CSS variables names are
 * following the pattern "--tg-theme-{name}". {name} is a theme parameters key name converted
 * from camel to kebab case.
 *
 * Example:
 * --tg-theme-bg-color
 * --tg-theme-secondary-text-color
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed ThemeParams instance.
 *
 * @param themeParams - ThemeParams instance.
 */
export function bindThemeParamsCSSVars(themeParams: ThemeParams): void {
  const actualize = () => {
    Object.entries(themeParams.getState()).forEach(([k, v]) => {
      if (v) {
        setCSSVar(`--tg-theme-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, v);
      }
    });
  };

  themeParams.on('change', actualize);

  actualize();
}
