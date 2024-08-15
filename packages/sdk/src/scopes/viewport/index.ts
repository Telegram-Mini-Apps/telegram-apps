import { off, on, type EventListener } from '@telegram-apps/bridge';
import { isPageReload } from '@telegram-apps/navigation';
import { computed, type Computed } from '@telegram-apps/signals';
import type { VoidFn } from '@telegram-apps/util-types';

import { $postEvent } from '@/scopes/globals/globals.js';
import { getStorageValue, setStorageValue } from '@/utils/storage.js';
import { retrieveLaunchParams } from '@/scopes/launch-params/retrieveLaunchParams.js';
import { createError } from '@/errors/createError.js';
import { ERR_CSS_VARS_BOUND } from '@/errors/errors.js';
import { deleteCssVar, setCssVar } from '@/utils/css-vars.js';
import { camelToKebab } from '@/utils/casing.js';

import { type GetCSSVarNameFn, request } from './static.js';
import * as _ from './private.js';
import type { State } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/viewport
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/viewport
 */

function createStateComputed<K extends keyof State>(key: K): Computed<State[K] | undefined> {
  return computed(() => _.state()[key]);
}

/**
 * Creates CSS variables connected with the current viewport.
 *
 * By default, created CSS variables names are following the pattern "--tg-theme-{name}", where
 * {name} is a theme parameters key name converted from camel case to kebab case.
 *
 * Default variables:
 * - `--tg-viewport-height`
 * - `--tg-viewport-width`
 * - `--tg-viewport-stable-height`
 *
 * Variables are being automatically updated if viewport was changed.
 *
 * @param getCSSVarName - function, returning complete CSS variable name for the specified
 * viewport property.
 * @returns Function to stop updating variables.
 */
export function bindCssVars(getCSSVarName?: GetCSSVarNameFn): VoidFn {
  if (_.isCssVarsBound()) {
    throw createError(ERR_CSS_VARS_BOUND);
  }
  getCSSVarName ||= (prop) => `--tg-viewport-${camelToKebab(prop)}`;
  const props = ['height', 'width', 'stableHeight'] as const;

  function actualize(): void {
    props.forEach(prop => {
      setCssVar(getCSSVarName!(prop), `${_.state()[prop]}px`);
    });
  }

  actualize();
  _.state.sub(actualize);
  _.isCssVarsBound.set(true);

  return () => {
    props.forEach(deleteCssVar);
    _.state.unsub(actualize);
    _.isCssVarsBound.set(false);
  };
}

/**
 * A method that expands the Mini App to the maximum available height. To find out if the Mini
 * App is expanded to the maximum height, refer to the value of the `isExpanded`.
 * @see isExpanded
 */
export function expand(): void {
  $postEvent()('web_app_expand');
}

function formatState(state: State): State {
  return {
    isExpanded: state.isExpanded,
    height: truncate(state.height),
    width: truncate(state.width),
    stableHeight: truncate(state.stableHeight),
  };
}

/**
 * The current height of the **visible area** of the Mini App.
 *
 * The application can display just the top part of the Mini App, with its lower part remaining
 * outside the screen area. From this position, the user can "pull" the Mini App to its
 * maximum height, while the bot can do the same by calling `expand` method. As the position of
 * the Mini App changes, the current height value of the visible area will be updated  in real
 * time.
 *
 * Please note that the refresh rate of this value is not sufficient to smoothly follow the
 * lower border of the window. It should not be used to pin interface elements to the bottom
 * of the visible area. It's more appropriate to use the value of the `stableHeight`
 * field for this purpose.
 *
 * @see stableHeight
 */
export const height = createStateComputed('height');

/**
 * True if the Mini App is expanded to the maximum available height. Otherwise, if
 * the Mini App occupies part of the screen and can be expanded to the full height using
 * `expand` method.
 * @see expand
 */
export const isExpanded = createStateComputed('isExpanded');

/**
 * True if the current viewport height is stable and is not going to change in the next moment.
 */
export const isStable = computed(() => {
  const s = _.state();
  return s.height === s.stableHeight;
});

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);

/**
 * True if the component is currently mounting.
 */
export const isMounting = computed(_.isMounting);

/**
 * True if CSS variables are currently bound.
 */
export const isCssVarsBound = computed(_.isCssVarsBound);

/**
 * Mounts the component.
 * todo
 */
export function mount(): void {
  if (_.isMounting() || _.isMounted()) {
    return;
  }
  _.isMounting.set(true);

  function finalizeMount(state: State): void {
    on('viewport_changed', onViewportChanged);
    _.state.set(formatState(state));
    _.state.sub(onStateChanged);
    _.mountError.set(undefined);
    _.isMounting.set(false);
    _.isMounted.set(true);
  }

  // Try to restore the state using the storage.
  const s = isPageReload() && getStorageValue('viewport');
  if (s) {
    return finalizeMount(s);
  }

  // If the platform has a stable viewport, it means we could use the window global object
  // properties.
  if (
    [
      'macos',
      'tdesktop',
      'unigram',
      'webk',
      'weba',
      'web',
    ].includes(retrieveLaunchParams().platform)
  ) {
    return finalizeMount({
      isExpanded: true,
      height: window.innerHeight,
      width: window.innerWidth,
      stableHeight: window.innerHeight,
    });
  }

  // We were unable to retrieve data locally. In this case, we are sending a request returning
  // the viewport information.
  request({ timeout: 1000 })
    .then((data) => {
      finalizeMount({
        height: data.height,
        isExpanded: data.isExpanded,
        stableHeight: data.isStable ? data.height : _.state().stableHeight,
        width: data.width,
      });
    })
    .catch(e => {
      _.mountError.set(e);
      _.isMounting.set(false);
      _.isMounted.set(false);
    });
}

/**
 * Error occurred while mounting the component.
 */
export const mountError = computed(_.mountError);

const onViewportChanged: EventListener<'viewport_changed'> = (data) => {
  _.state.set(formatState({
    height: data.height,
    width: data.width,
    isExpanded: data.is_expanded,
    stableHeight: data.is_state_stable ? data.height : _.state().stableHeight,
  }));
};

function onStateChanged(s: State): void {
  setStorageValue('viewport', s);
}

/**
 * Complete component state.
 */
export const state = computed(_.state);

/**
 * The height of the visible area of the Mini App in its last stable state.
 *
 * The application can display just the top part of the Mini App, with its lower part remaining
 * outside the screen area. From this position, the user can "pull" the Mini App to its
 * maximum height, while the application can do the same by calling `expand` method.
 *
 * Unlike the value of `height`, the value of `stableHeight` does not change as the position
 * of the Mini App changes with user gestures or during animations. The value of `stableHeight`
 * will be updated after all gestures and animations are completed and the Mini App reaches its
 * final size.
 *
 * @see height
 */
export const stableHeight = createStateComputed('stableHeight');

/**
 * Formats value to make it stay in bounds [0, +Inf).
 * @param value - value to format.
 */
function truncate(value: number): number {
  return value < 0 ? 0 : value;
}

/**
 * Unmounts the component.
 * todo
 */
export function unmount(): void {
  off('viewport_changed', onViewportChanged);
  _.state.unsub(onStateChanged);
}

/**
 * Currently visible area width.
 */
export const width = createStateComputed('width');
