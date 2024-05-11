import { setCSSVar } from '@/css-vars/setCSSVar.js';
import type { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';
import type { CleanupFn } from '@/types/index.js';

export interface GetThemeParamsCSSVarNameFn {
  /**
   * @param property - ThemeParams property.
   * @returns Computed complete CSS variable name.
   */
  (property: string): string;
}

/**
 * Creates CSS variables connected with the passed instance of the ThemeParams class.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab case.
 *
 * Example:
 * --tg-theme-bg-color
 * --tg-theme-secondary-text-color
 *
 * Variables are being automatically updated in case, corresponding properties updated in
 * the passed ThemeParams instance.
 *
 * @param themeParams - ThemeParams instance.
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * ThemeParams property.
 * @returns Function to stop updating variables.
 */
export function bindThemeParamsCSSVars(
  themeParams: ThemeParams,
  getCSSVarName?: GetThemeParamsCSSVarNameFn,
): CleanupFn {
  getCSSVarName ||= (property) => {
    return `--tg-theme-${property.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
  };

  const actualize = () => {
    Object.entries(themeParams.getState()).forEach(([k, v]) => {
      if (v) {
        setCSSVar(getCSSVarName(k), v);
      }
    });
  };

  actualize();

  return themeParams.on('change', actualize);
}
