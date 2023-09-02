import { postEvent as bridgePostEvent, supports } from '@twa.js/bridge';

import { ThemeParams, Viewport } from '../components/index.js';
import { MethodUnsupportedError } from '../lib/index.js';

import type { ThemeParams as TwaThemeParams } from '../utils/index.js';
import type {
  InitCSSVarsOption,
  InitCSSVarsSpecificOption,
} from './types.js';
import type { PostEvent } from '../types.js';

/**
 * Creates synced instance of Viewport.
 * @param postEvent
 */
export function createSyncedViewport(postEvent: PostEvent = bridgePostEvent): Viewport {
  const viewport = new Viewport(
    window.innerHeight,
    window.innerWidth,
    window.innerHeight,
    true,
    postEvent,
  );
  Viewport.sync(viewport);

  return viewport;
}

/**
 * Creates synced instance of ThemeParams.
 * @param params - theme parameters.
 */
export function createSyncedThemeParams(params: TwaThemeParams): ThemeParams {
  const themeParams = new ThemeParams(params);
  ThemeParams.sync(themeParams);

  return themeParams;
}

/**
 * Creates postEvent function.
 * @param checkCompat - should compatibility check be enabled.
 * @param version - platform version.
 */
export function createPostEvent(checkCompat: boolean, version: string): PostEvent {
  return checkCompat
    ? (method: any, params?: any) => {
      if (!supports(method, version)) {
        throw new MethodUnsupportedError(method, version);
      }
      return bridgePostEvent(method, params);
    }
    : bridgePostEvent;
}

/**
 * Converts init cssVars option to more narrow type.
 * @param option - option value.
 */
export function parseCSSVarsOptions(option: InitCSSVarsOption): InitCSSVarsSpecificOption {
  if (typeof option === 'boolean') {
    return option
      ? { themeParams: true, viewport: true, webApp: true }
      : {};
  }
  return option;
}
