import { isRGB } from '@/colors/isRGB.js';
import type { MiniApp } from '@/components/mini-app/MiniApp.js';
import type { ThemeParams } from '@/components/theme-params/ThemeParams.js';

import { setCSSVar } from './setCSSVar.js';

/**
 * Creates CSS variables connected with WebApp background and header colors based on
 * passed WebApp and ThemeParams instances.
 *
 * Created variables:
 * - `--tg-bg-color`
 * - `--tg-header-color`
 *
 * Variables are being automatically updated in case, corresponding properties are updating.
 *
 * @param miniApp - MiniApp instance.
 * @param themeParams - ThemeParams instance.
 */
export function bindMiniAppCSSVars(miniApp: MiniApp, themeParams: ThemeParams): void {
  const actualizeBackground = () => setCSSVar('--tg-bg-color', miniApp.bgColor);

  const actualizeHeader = () => {
    const { headerColor } = miniApp;

    if (isRGB(headerColor)) {
      setCSSVar('--tg-header-color', headerColor);
      return;
    }

    const { bgColor, secondaryBgColor } = themeParams;

    if (headerColor === 'bg_color' && bgColor) {
      setCSSVar('--tg-header-color', bgColor);
    } else if (headerColor === 'secondary_bg_color' && secondaryBgColor) {
      setCSSVar('--tg-header-color', secondaryBgColor);
    }
  };

  themeParams.on('change', actualizeHeader);
  miniApp.on('change:bgColor', actualizeBackground);
  miniApp.on('change:headerColor', actualizeHeader);

  actualizeBackground();
  actualizeHeader();
}
