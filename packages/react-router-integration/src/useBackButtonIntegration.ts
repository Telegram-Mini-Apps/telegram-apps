import type { BrowserNavigator } from '@tma.js/sdk-react';
import { useEffect } from 'react';

export interface BackButtonLike {
  show(): void;
  hide(): void;
  on(event: 'click', listener: () => void): () => void;
}

/**
 * Controls specified Back Button visibility state and moves navigator's cursor back if user
 * pressed the Back Button.
 * @param nav - Mini Apps navigator.
 * @param backButton - Mini Apps Back Button.
 */
export function useBackButtonIntegration(nav: BrowserNavigator<any>, backButton: BackButtonLike): void {
  // When Mini Apps navigator changes its location, we should actualize the reactive values.
  useEffect(() => {
    return nav.on('change', () => {
      if (nav.hasPrev) {
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
