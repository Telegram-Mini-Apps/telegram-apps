import { setCSSVar } from '@/css-vars/setCSSVar.js';
import type { Viewport } from '@/components/Viewport/Viewport.js';
import type { CleanupFn } from '@/types/index.js';

export interface GetViewportCSSVarNameFn {
  /**
   * @param property - Viewport property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'width' | 'height' | 'stable-height'): string;
}

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
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * Viewport property.
 * @returns Function to stop updating variables.
 */
export function bindViewportCSSVars(
  viewport: Viewport,
  getCSSVarName?: GetViewportCSSVarNameFn,
): CleanupFn {
  getCSSVarName ||= (property) => `--tg-viewport-${property}`;
  const [
    heightVar,
    widthVar,
    stableHeightVar,
  ] = (['height', 'width', 'stable-height'] as const).map((prop) => getCSSVarName(prop));
  const setHeight = () => setCSSVar(heightVar, `${viewport.height}px`);
  const setWidth = () => setCSSVar(widthVar, `${viewport.width}px`);
  const setStableHeight = () => setCSSVar(stableHeightVar, `${viewport.stableHeight}px`);

  // TODO: Should probably add debounce or throttle.
  const listeners = [
    viewport.on('change:height', setHeight),
    viewport.on('change:width', setWidth),
    viewport.on('change:stableHeight', setStableHeight),
  ];

  setHeight();
  setWidth();
  setStableHeight();

  return () => listeners.forEach(off => off());
}
