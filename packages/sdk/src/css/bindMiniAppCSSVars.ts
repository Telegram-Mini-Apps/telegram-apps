import { setCSSVar } from './setCSSVar.js';
import { isRGB } from '../colors/isRGB.js';
import type { MiniApp } from '../components/mini-app/MiniApp.js';
import type { ThemeParams } from '../components/theme-params/ThemeParams.js';

/**
 * Creates CSS variables connected with WebApp background and header colors based on
 * passed WebApp and ThemeParams instances.
 *
 * Created variables:
 * - `--tg-background-color`
 * - `--tg-header-color`
 *
 * Variables are being automatically updated in case, corresponding properties are updating.
 *
 * @param miniApp - MiniApp instance.
 * @param themeParams - ThemeParams instance.
 */
export function bindMiniAppCSSVars(miniApp: MiniApp, themeParams: ThemeParams): void {
  const actualizeBackground = () => {
    setCSSVar('--tg-background-color', miniApp.backgroundColor);
  };

  const actualizeHeader = () => {
    const {
      backgroundColor,
      secondaryBackgroundColor,
    } = themeParams;

    if (isRGB(miniApp.headerColor)) {
      setCSSVar('--tg-header-color', miniApp.headerColor);
      return;
    }

    if (miniApp.headerColor === 'bg_color' && backgroundColor) {
      setCSSVar('--tg-header-color', backgroundColor);
      return;
    }

    if (miniApp.headerColor === 'secondary_bg_color' && secondaryBackgroundColor) {
      setCSSVar('--tg-header-color', secondaryBackgroundColor);
    }
  };

  themeParams.on('change', actualizeHeader);
  miniApp.on('change:backgroundColor', actualizeBackground);
  miniApp.on('change:headerColor', actualizeHeader);

  actualizeBackground();
  actualizeHeader();
}
