import { initViewportFromRequest } from '@/components/Viewport/initViewportFromRequest.js';
import { logger } from '@/debug/debug.js';
import { isSSR } from '@/env/isSSR.js';
import { createError } from '@/errors/createError.js';
import { ERROR_SSR_INIT } from '@/errors/errors.js';
import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';
import type { FactoryOptions } from '@/init/createComponentInitFn/types.js';

import { Viewport } from './Viewport.js';
import type { ViewportState } from './types.js';

function instantiate({
  state,
  platform,
  postEvent,
}: FactoryOptions<'platform', ViewportState>): Viewport {
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
  } else if (['macos', 'tdesktop', 'unigram', 'webk', 'weba'].includes(platform)) {
    // If platform has a stable viewport, it means we could instantiate Viewport using
    // the window global object properties.
    isExpanded = true;
    height = window.innerHeight;
    width = window.innerWidth;
    stableHeight = window.innerHeight;
  }

  // Otherwise, Viewport instance will be created using zero values.

  return new Viewport({
    postEvent,
    height,
    width,
    stableHeight,
    isExpanded,
  });
}

/**
 * @returns A promise with a new initialized instance of the `Viewport` class.
 * @see Viewport
 */
export const initViewport = createInitFn<'viewport', Promise<Viewport>, 'platform'>(
  'viewport',
  async (options) => {
    if (isSSR() && !options.state) {
      throw createError(
        ERROR_SSR_INIT,
        'Viewport cannot be instantiated on the server side without passing the ssr.state object.',
      );
    }

    let viewport = instantiate(options);

    // On the server side we have no need to do anything else with the viewport.
    if (isSSR()) {
      return viewport;
    }

    // We will have viewport width equal to 0 in case, we were not able to instantiate it
    // normally using previous state. In this case we should instantiate it using a Mini Apps
    // method.
    if (viewport.width === 0) {
      // Here, we are on the client side. We instantiate Viewport using Mini Apps method.
      await initViewportFromRequest(options.postEvent, { timeout: 1000 })
        .then((v) => viewport = v)
        .catch((e) => logger.error('Unable to sync viewport state', e));
    }

    // Listen to the viewport external changes and actualize local instance.
    viewport.listen();

    return viewport;
  },
);
