import { createIntegration, type RouterIntegration } from '@solidjs/router';
import type { HashNavigator } from '@navigation/index.js';
import type { Accessor } from 'solid-js';

function querySelector<T extends Element>(selector: string) {
  // Guard against selector being an invalid CSS selector
  try {
    return document.querySelector<T>(selector);
  } catch (e) {
    return null;
  }
}

function scrollToHash(hash: string, fallbackTop?: boolean) {
  const el = querySelector(`#${hash}`);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}

export function navigatorIntegration(
  navigator: Accessor<HashNavigator>,
): RouterIntegration {
  return createIntegration(
    () => navigator().path,
    ({ scroll, value, replace }) => {
      if (replace) {
        navigator().replace(value);
      } else {
        navigator().push(value);
      }
      const hashIndex = value.indexOf('#');
      const hash = hashIndex >= 0 ? value.slice(hashIndex + 1) : '';
      scrollToHash(hash, scroll);
    },
    notify => {
      const onChange = () => notify();
      const nav = navigator();
      nav.on('change', onChange);

      return () => {
        nav.off('change', onChange);
      };
    },
    {
      go(delta: number) {
        navigator().go(delta);
      },
      renderPath: path => `#${path}`,
      parsePath: str => {
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