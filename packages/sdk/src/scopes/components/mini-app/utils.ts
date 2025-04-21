import type { Computed } from '@telegram-apps/signals';
import type { RGB } from '@telegram-apps/types';
import { isRGB } from '@telegram-apps/transformers';

import { state as themeParamsState } from '@/scopes/components/theme-params/signals.js';
import { createComputed } from '@/signals-registry.js';

import type { AnyColor } from './types.js';

// #__NO_SIDE_EFFECTS__
export function rgbComputedBasedOn(signal: Computed<AnyColor>): Computed<RGB | undefined> {
  return createComputed<RGB | undefined>(() => rgbBasedOn(signal()));
}

export function rgbBasedOn(color: AnyColor): RGB | undefined {
  return isRGB(color) ? color : themeParamsState()[color];
}