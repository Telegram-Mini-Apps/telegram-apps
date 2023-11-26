import {
  createIntegration as createRouterIntegration,
  type RouterIntegration,
} from '@solidjs/router';
import {
  getHash,
  type HashNavigator,
  type HashNavigatorEventListener,
} from '@tma.js/sdk';

type Accessor<T> = () => T;

/**
 * Guard against selector being an invalid CSS selector.
 * @param selector - CSS selector.
 */
function querySelector<T extends Element>(selector: string) {
  try {
    return document.querySelector<T>(selector);
  } catch (e) {
    return null;
  }
}

/**
 * Scrolls to specified hash.
 * @param hash - hash to scroll to.
 * @param fallbackTop - should scroll be performed to the beginning of the page in case
 * hash was not found on the page.
 */
function scrollToHash(hash: string, fallbackTop: boolean) {
  const el = querySelector(`#${hash}`);
  if (el) {
    el.scrollIntoView();
    return;
  }

  if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}

/**
 * Creates integration for `@solidjs/router` package.
 * @param navigator - HashNavigator accessor.
 */
export function createIntegration(navigator: Accessor<HashNavigator>): RouterIntegration {
  return createRouterIntegration(
    // Router calls this getter whenever it wants to get actual navigation state.
    () => navigator().path,

    // Setter is called when some of the router functionality was used. For example, <Navigate/>.
    ({ scroll = false, value = '', replace = false }) => {
      if (replace) {
        void navigator().replace(value);
      } else {
        void navigator().push(value);
      }
      const hash = getHash(value);
      if (!hash) {
        return;
      }

      const scrollTo = getHash(hash);
      if (!scrollTo) {
        return;
      }
      scrollToHash(scrollTo, scroll);
    },

    // This function is called when Router context is initialized. It is the best place to
    // bind to navigator state changes, which could occur outside.
    (notify: (value: string) => void) => {
      const onChange: HashNavigatorEventListener<'change'> = (event) => {
        const {
          to: {
            hash,
            pathname,
            search,
          },
        } = event;

        notify(`${pathname}${search}${hash}`);
      };

      return navigator().on('change', onChange);
    },
    {
      go(delta: number) {
        void navigator().go(delta);
      },
      renderPath: (path: string) => `#${path}`,
      parsePath: (str: string) => {
        const to = str.replace(/^.*?#/, '');
        if (to.startsWith('/')) {
          return to;
        }

        // Hash-only hrefs like `#foo` from plain anchors will come in as `/#foo` whereas a link to
        // `/foo` will be `/#/foo`. Check if the to starts with a `/` and if not append it as a hash
        // to the current path so we can handle these in-page anchors correctly.
        const [, path = '/'] = window.location.hash.split('#', 2);
        return `${path}#${to}`;
      },
    },
  );
}
