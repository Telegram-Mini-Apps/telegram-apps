import {
  off,
  on,
  type EventListener,
} from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { getStorageValue, setStorageValue, snakeToKebab } from '@telegram-apps/toolkit';
import type { RGB, ThemeParams } from '@telegram-apps/types';
import { AbortablePromise } from 'better-promises';

import { createWrapMounted } from '@/scopes/wrappers/createWrapMounted.js';
import { createWrapBasic } from '@/scopes/wrappers/createWrapBasic.js';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';
import { CSSVarsBoundError } from '@/errors.js';
import { defineMountFn } from '@/scopes/defineMountFn.js';
import { request } from '@/globals.js';
import type { RequestOptionsNoCapture } from '@/types.js';

import { _isCssVarsBound, _state } from './signals.js';
import type { GetCssVarNameFn } from './types.js';
import { signalCancel } from '@/scopes/signalCancel.js';

type StorageValue = ThemeParams;

const COMPONENT_NAME = 'themeParams';
const THEME_CHANGED_EVENT = 'theme_changed';
const wrapBasic = createWrapBasic(COMPONENT_NAME);

const onThemeChanged: EventListener<'theme_changed'> = ({ theme_params: value }) => {
  _state.set(value);
  setStorageValue<StorageValue>(COMPONENT_NAME, value);
};

const [
  mountFn,
  tMountPromise,
  tMountError,
  tIsMounted,
] = defineMountFn(
  COMPONENT_NAME,
  (options?: RequestOptionsNoCapture) => {
    const s = isPageReload() && getStorageValue<StorageValue>(COMPONENT_NAME);
    return s
      ? AbortablePromise.resolve(s)
      : request('web_app_request_theme', 'theme_changed', options).then(d => d.theme_params);
  },
  s => {
    on(THEME_CHANGED_EVENT, onThemeChanged);
    _state.set(s);
  },
);

const wrapMounted = createWrapMounted(COMPONENT_NAME, tIsMounted[0]);

/**
 * Creates CSS variables connected with the current theme parameters.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from snake case to kebab case.
 *
 * Default variables:
 * - `--tg-theme-bg-color`
 * - `--tg-theme-secondary-text-color`
 *
 * Variables are being automatically updated if theme parameters were changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * theme parameters key.
 * @returns Function to stop updating variables.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {CSSVarsBoundError} CSS variables are already bound
 * @throws {FunctionNotAvailableError} The parent component is not mounted
 * @example Using no arguments
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars();
 * }
 * @example Using custom CSS vars generator
 * if (bindCssVars.isAvailable()) {
 *   bindCssVars(key => `--my-prefix-${key}`);
 * }
 */
export const bindCssVars = wrapMounted(
  'bindCssVars',
  (getCSSVarName?: GetCssVarNameFn): VoidFunction => {
    if (_isCssVarsBound()) {
      throw new CSSVarsBoundError();
    }

    getCSSVarName ||= (prop) => `--tg-theme-${snakeToKebab(prop)}`;

    function forEachEntry(fn: (key: string, value: RGB) => void): void {
      Object.entries(_state()).forEach(([k, v]) => {
        v && fn(k, v);
      });
    }

    function actualize(): void {
      forEachEntry((k, v) => {
        setCssVar(getCSSVarName!(k), v);
      });
    }

    actualize();
    _state.sub(actualize);
    _isCssVarsBound.set(true);

    return () => {
      forEachEntry(deleteCssVar);
      _state.unsub(actualize);
      _isCssVarsBound.set(false);
    };
  },
);

/**
 * Mounts the Theme Params component restoring its state.
 * @throws {FunctionNotAvailableError} The environment is unknown
 * @throws {FunctionNotAvailableError} The SDK is not initialized
 * @throws {FunctionNotAvailableError} The function is not supported
 * @example
 * if (mount.isAvailable()) {
 *   await mount();
 * }
 */
export const mount = wrapBasic('mount', mountFn);
export const [, mountPromise, isMounting] = tMountPromise;
export const [, mountError] = tMountError;
export const [_isMounted, isMounted] = tIsMounted;

/**
 * Unmounts the Theme Params component.
 */
export function unmount(): void {
  signalCancel(mountPromise);
  off(THEME_CHANGED_EVENT, onThemeChanged);
  _isMounted.set(false);
}