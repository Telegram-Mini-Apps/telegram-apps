import type { BackButton, HashNavigator } from '@tma.js/sdk';
import { useEffect } from 'react';

/**
 * Controls specified Back Button visibility state and moves navigator's cursor back if user
 * pressed the Back Button.
 * @param nav - Mini Apps navigator.
 * @param backButton - Mini Apps Back Button.
 */
export function useBackButtonIntegration(nav: HashNavigator, backButton: BackButton): void {
  // When Mini Apps navigator changes its location, we should actualize the reactive values.
  useEffect(() => {
    return nav.on('change', () => {
      if (nav.canGoBack) {
        backButton.show();
      } else {
        backButton.hide();
      }
    });
  }, [nav, backButton]);

  // When user presses the Back Button, we navigate back.
  useEffect(() => {
    return backButton.on('click', () => nav.back());
  }, [backButton, nav]);
}
