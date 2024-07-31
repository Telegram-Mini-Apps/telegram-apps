import { postEvent } from '@/scopes/globals/globals.js';

import { isPageReload } from '@/navigation/isPageReload.js';
import { getStorageValue, setStorageValue } from '@/storage/storage.js';
import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { off } from '@/bridge/events/listening/off.js';
import { on } from '@/bridge/events/listening/on.js';
import type { MiniAppsEventListener } from '@/bridge/events/types.js';

import { request } from './static.js';
import * as _ from './private.js';
import type { State } from './types.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/viewport
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/components/viewport
 */

/**
 * A method that expands the Mini App to the maximum available height. To find out if the Mini
 * App is expanded to the maximum height, refer to the value of the `isExpanded`.
 * @see isExpanded
 */
function expand(): void {
  postEvent()('web_app_expand');
}

/**
 * Mounts the component.
 */
function mount(): void {
  if (_.isMounting() || _.isMounted()) {
    return;
  }
  _.isMounting.set(true);

  function finalizeMount(state: State) {
    on('viewport_changed', onViewportChanged);
    _.state.set(state);
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

const onViewportChanged: MiniAppsEventListener<'viewport_changed'> = (data) => {
  _.state.set({
    height: data.height,
    width: data.width,
    isExpanded: data.is_expanded,
    stableHeight: data.is_state_stable ? data.height : _.state().stableHeight,
  });
};

function onStateChanged(s: State) {
  setStorageValue('viewport', s);
}

/**
 * Unmounts the component.
 */
function unmount(): void {
  off('viewport_changed', onViewportChanged);
  _.state.unsub(onStateChanged);
}

export {
  expand,
  mount,
  unmount,
};
export {
  height,
  isExpanded,
  isMounted,
  isMounting,
  isStable,
  mountError,
  stableHeight,
  state,
  width,
} from './computed.js';
