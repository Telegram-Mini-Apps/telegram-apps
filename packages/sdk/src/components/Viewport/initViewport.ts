import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { Viewport } from './Viewport.js';
import { requestViewport } from '@/components/Viewport/requestViewport.js';

/**
 * @returns A promise with a new initialized instance of the `Viewport` class.
 * @see Viewport
 */
export const initViewport = createComponentInitFn(
  'viewport',
  async ({ state, platform, postEvent, addCleanup }) => {
    let isExpanded = false;
    let height = 0;
    let width = 0;
    let stableHeight = 0;

    // State was saved previously, we restore the Viewport from this state.
    if (state) {
      isExpanded = state.isExpanded;
      height = state.height;
      width = state.width;
      stableHeight = state.stableHeight;
    } else if (['macos', 'tdesktop', 'unigram', 'webk', 'weba', 'web'].includes(platform)) {
      // If platform has a stable viewport, it means we could instantiate Viewport using
      // the window global object properties.
      isExpanded = true;
      height = window.innerHeight;
      width = window.innerWidth;
      stableHeight = window.innerHeight;
    } else {
      // We were unable to retrieve data locally. In this case we are sending a request returning
      // a viewport information.
      const response = await requestViewport({ timeout: 1000, postEvent });
      isExpanded = response.isExpanded;
      height = response.height;
      width = response.width;
      stableHeight = response.isStateStable ? height : 0;
    }

    // Otherwise, Viewport instance will be created using zero values.
    const viewport = new Viewport({
      postEvent,
      height,
      width,
      stableHeight,
      isExpanded,
    });

    // Listen to the viewport external changes and actualize local instance.
    addCleanup(viewport.listen());

    return viewport;
  },
);
