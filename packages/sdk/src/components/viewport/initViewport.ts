import { createInitFn } from '@/components/createInitFn.js';
import { error } from '@/debug/debug.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

import { Viewport } from './Viewport.js';

/**
 * @returns A new initialized instance of Viewport class.
 */
export const initViewport = createInitFn(
  'viewport',
  ({ postEvent }, state) => {
    const viewport = new Viewport(
      ['macos', 'tdesktop', 'unigram', 'webk', 'weba']
        .includes(retrieveLaunchParams().platform)
        // If platform has a stable viewport, it means we could instantiate Viewport using
        // the window global object properties.
        ? {
          height: window.innerHeight,
          isExpanded: true,
          postEvent,
          stableHeight: window.innerHeight,
          width: window.innerWidth,
        }
        // Otherwise set defaults and merge them with last data stored in the storage.
        : {
          height: 0,
          isExpanded: false,
          postEvent,
          stableHeight: 0,
          width: 0,
          ...state,
        },
    );

    if (viewport.width === 0) {
      // It seems like currently, viewport is in its initial state. We get into this case when
      // the platform is not stable, and we had no previously saved state. This means, we
      // should actualize the state using the Mini Apps method.
      viewport.sync({ postEvent, timeout: 1000 }).catch((e) => {
        error('Unable to sync viewport state', e);
      });
    }

    // Listen to the viewport external changes and actualize local instance.
    viewport.listen();

    return viewport;
  },
);
