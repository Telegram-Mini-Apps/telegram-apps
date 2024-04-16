import type { Viewport } from '@/components/viewport/Viewport.js';

import { setCSSVar } from './setCSSVar.js';

/**
 * Accepts Viewport instance and sets CSS variables connected with viewport
 * sizes.
 *
 * Be careful using this function as long as it can impact application
 * performance. Viewport size is changing rather often, this makes CSS
 * variables update, which leads to possible layout redraw.
 *
 * Variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-width`
 * - `--tg-viewport-stable-height`
 *
 * Variables are being automatically updated in case, corresponding properties
 * updated in passed Viewport instance.
 *
 * @param viewport - Viewport instance.
 */
export function bindViewportCSSVars(viewport: Viewport): void {
  const setHeight = () => setCSSVar('--tg-viewport-height', `${viewport.height}px`);
  const setWidth = () => setCSSVar('--tg-viewport-width', `${viewport.width}px`);
  const setStableHeight = () => setCSSVar('--tg-viewport-stable-height', `${viewport.stableHeight}px`);

  // TODO: Should probably add debounce or throttle.
  viewport.on('change:height', setHeight);
  viewport.on('change:width', setWidth);
  viewport.on('change:stableHeight', setStableHeight);

  setHeight();
  setWidth();
  setStableHeight();
}
