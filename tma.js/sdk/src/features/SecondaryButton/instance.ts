import { computed } from '@tma.js/signals';

import { SecondaryButton } from '@/features/SecondaryButton/SecondaryButton.js';
import { bottomButtonOptions } from '@/fn-options/bottomButtonOptions.js';
import { themeParams } from '@/features/ThemeParams/instance.js';
import { miniApp } from '@/features/MiniApp/instance.js';

export const secondaryButton = new SecondaryButton(
  bottomButtonOptions('secondaryButton', 'secondary_button_pressed', {
    bgColor: computed(() => miniApp.bottomBarColorRgb() || '#000000'),
    textColor: computed(() => themeParams.buttonColor() || '#2481cc'),
  }),
);
