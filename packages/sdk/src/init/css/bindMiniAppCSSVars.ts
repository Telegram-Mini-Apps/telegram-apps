import { setCSSVar } from '~/init/css/setCSSVar.js';
import type { MiniApp } from '~/mini-app/index.js';
import type { ThemeParams } from '~/theme-params/index.js';

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

    if (miniApp.headerColor === 'bg_color') {
      if (backgroundColor) {
        setCSSVar('--tg-header-color', backgroundColor);
      }
    } else if (miniApp.headerColor === 'secondary_bg_color') {
      if (secondaryBackgroundColor) {
        setCSSVar('--tg-header-color', secondaryBackgroundColor);
      }
    } else {
      setCSSVar('--tg-header-color', miniApp.headerColor);
    }
  };

  themeParams.on('changed', actualizeHeader);
  miniApp.on('backgroundColorChanged', actualizeBackground);
  miniApp.on('headerColorChanged', actualizeHeader);

  actualizeBackground();
  actualizeHeader();
}
