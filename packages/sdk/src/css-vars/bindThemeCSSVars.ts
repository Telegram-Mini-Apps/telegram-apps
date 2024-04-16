import type { ThemeParams } from '@/components/theme-params/ThemeParams.js';

import { setCSSVar } from './setCSSVar.js';

/**
 * Creates CSS variables connected with theme parameters. Created CSS variables names are
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
export function bindThemeCSSVars(themeParams: ThemeParams): void {
  const actualize = () => Object.entries(themeParams.getState()).forEach(([k, v]) => {
    if (v) {
      setCSSVar(
        `--tg-theme-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
        v,
      );
    }
  });

  themeParams.on('change', actualize);

  actualize();
}
