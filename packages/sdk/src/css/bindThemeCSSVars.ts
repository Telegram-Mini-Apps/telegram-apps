import { setCSSVar } from './setCSSVar.js';
import type { ThemeParams } from '../theme-params/index.js';

/**
 * Creates CSS variables connected with theme parameters. Created CSS variables names are
 * following the pattern "--tg-theme-{name}". {name} is a theme parameters key name converted
 * from snake to kebab case.
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed ThemeParams instance.
 *
 * @param themeParams - ThemeParams instance.
 */
export function bindThemeCSSVars(themeParams: ThemeParams): void {
  const actualize = () => {
    const state = themeParams.getState();

    Object.entries(state).forEach(([k, v]) => {
      if (v) {
        const key = k
          .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        setCSSVar(`--tg-theme-${key}`, v);
      }
    });
  };

  themeParams.on('change', actualize);

  actualize();
}
