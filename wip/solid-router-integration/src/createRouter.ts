import { type BaseRouterProps, createRouter as createSolidRouter } from '@solidjs/router';
import { Navigator, urlToPath } from '@telegram-apps/navigation';
import type { Component } from 'solid-js';

// /**
//  * Guard against selector being an invalid CSS selector.
//  * @param selector - CSS selector.
//  */
// function querySelector<T extends Element>(selector: string) {
//   try {
//     return document.querySelector<T>(selector);
//   } catch {
//     return null;
//   }
// }

// /**
//  * Scrolls to specified hash.
//  * @param hash - hash to scroll to.
//  * @param fallbackTop - should scroll be performed to the beginning of the page in case
//  * hash was not found on the page.
//  */
// function scrollToHash(hash: string, fallbackTop: boolean) {
//   const el = querySelector(`#${hash}`);
//   if (el) {
//     el.scrollIntoView();
//     return;
//   }
//
//   if (fallbackTop) {
//     window.scrollTo(0, 0);
//   }
// }

/**
 * Creates a new Router for the application.
 * @param navigator - browser navigator.
 */
export function createRouter<State>(
  navigator: Navigator<State>,
): Component<BaseRouterProps> {
  const location = navigator.location;

  return createSolidRouter({
    get: () => {
      const res = urlToPath(location());
      console.log('get', res);
      return res;
    },
    init: (notify) => {
      return location.sub((l) => {
        console.log('Changed', l);
        notify()
      });
    },
    set: ({ value, state, ...next }) => {
      console.warn('set', value, state, next);
      // TODO: We should check all cases with the "state" variable. Not sure, if it always fits
      //  the typing of State.
      if (next.replace) {
        navigator.replace(value, state as State);
      } else {
        navigator.push(value, state as State);
      }

      // todo
      // const hash = getHash(value);
      // if (hash) {
      //   scrollToHash(hash, next.scroll || false);
      // }
    },
    utils: {
      go: (delta) => {
        console.log('go', delta);
        navigator.go(delta);
      },
      renderPath: (path) => {
        console.log('render', path, navigator.renderPath(path));
        return navigator.renderPath(path);
      },
      parsePath: (path) => {
        console.log('parse', path, urlToPath(navigator.parsePath(path)));
        return urlToPath(navigator.parsePath(path));
      },
    },
  });
}
