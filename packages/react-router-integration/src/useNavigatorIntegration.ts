import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Location, Navigator } from 'react-router-dom';
import { BrowserNavigator, urlToPath } from '@tma.js/sdk-react';

/**
 * Uses passed Mini Apps navigator and returns tuple containing reactive values representing
 * current location and react-router-dom navigator.
 * @param nav - Mini Apps navigator.
 */
export function useNavigatorIntegration<State>(nav: BrowserNavigator<State>): [Location, Navigator] {
  // Creates location based on the Mini Apps navigator.
  const createLocation = useCallback(() => ({
    state: null,
    key: '',
    pathname: nav.pathname,
    hash: nav.hash,
    search: nav.search,
  }), [nav]);

  const [location, setLocation] = useState(createLocation);

  // TODO: This works fine only with the hash router.

  // Create Navigator appropriate to the react-router-dom package.
  const navigator = useMemo<Navigator>(() => ({
    go(a) {
      nav.go(a);
    },
    push(to, state, { replace = false, ...options} = { }) {
      if (state === undefined) {
        state = options.state;
      }
      const path = urlToPath(to);
      if (replace) {
        nav.replace(path, state);
      } else {
        nav.push(path, state);
      }
    },
    replace(to, state, { replace = true, ...options} = { }) {
      if (state === undefined) {
        state = options.state;
      }
      const path = urlToPath(to);
      if (replace) {
        nav.replace(path, state);
      } else {
        nav.push(path, state);
      }
    },
    createHref: (to) => `#${urlToPath(to)}`,
    encodeLocation: (to) => new URL(`#${urlToPath(to)}`, 'http://localhost'),
  }), [nav]);

  // When Mini Apps navigator changes its location, we should actualize the reactive values.
  useEffect(() => {
    return nav.on('change', () => setLocation(createLocation()));
  }, [nav, createLocation]);

  return [location, navigator];
}
