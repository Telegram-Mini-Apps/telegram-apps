import { isRGB } from '@/colors/isRGB.js';
import { setCSSVar } from '@/css-vars/setCSSVar.js';
import type { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';

import type { MiniApp } from '../components/MiniApp/MiniApp.js';

export interface GetMiniAppCSSVarNameFn {
  /**
   * @param property - MiniApp property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'bg' | 'header'): string;
}

/**
 * Creates CSS variables connected with the MiniApps class instance background and header colors
 * based on the passed MiniApp and ThemeParams instances.
 *
 * Created variables by default:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 *
 * Variables are being automatically updated in case, corresponding MiniApp and ThemeParams
 * properties were updated.
 *
 * @param miniApp - MiniApp instance.
 * @param themeParams - ThemeParams instance.
 * @param getVarName - function, returning complete CSS variable name for the specified
 * MiniApp property.
 */
export function bindMiniAppCSSVars(
  miniApp: MiniApp,
  themeParams: ThemeParams,
  getVarName?: GetMiniAppCSSVarNameFn,
): void {
  getVarName ||= (property) => `--tg-${property}-color`;

  const headerVar = getVarName('header');
  const bgVar = getVarName('bg');
  const actualizeBackground = () => setCSSVar(bgVar, miniApp.bgColor);

  const actualizeHeader = () => {
    const { headerColor } = miniApp;

    if (isRGB(headerColor)) {
      setCSSVar(headerVar, headerColor);
    } else {
      const { bgColor, secondaryBgColor } = themeParams;

      if (headerColor === 'bg_color' && bgColor) {
        setCSSVar(headerVar, bgColor);
      } else if (headerColor === 'secondary_bg_color' && secondaryBgColor) {
        setCSSVar(headerVar, secondaryBgColor);
      }
    }
  };

  themeParams.on('change', actualizeHeader);
  miniApp.on('change:bgColor', actualizeBackground);
  miniApp.on('change:headerColor', actualizeHeader);

  actualizeBackground();
  actualizeHeader();
}
