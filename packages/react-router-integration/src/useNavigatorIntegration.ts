import type { HashNavigator } from '@tma.js/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Location, Navigator, To } from 'react-router-dom';

function formatTo(to: To): string {
  return typeof to === 'string'
    ? to
    : `${to.pathname}${to.search}${to.hash}`;
}

/**
 * Uses passed Mini Apps navigator and returns tuple containing reactive values representing
 * current location and react-router-dom navigator.
 * @param nav - Mini Apps navigator.
 */
export function useNavigatorIntegration(nav: HashNavigator): [Location, Navigator] {
  const {
    pathname,
    hash,
    search,
    go,
    push,
    replace,
  } = nav;

  // Creates location based on the Mini Apps navigator.
  const createLocation = useCallback(() => ({
    state: null,
    key: '',
    pathname,
    hash,
    search,
  }), [pathname, hash, search]);

  const [location, setLocation] = useState(createLocation);

  // Create Navigator appropriate to the react-router-dom package.
  const navigator = useMemo<Navigator>(() => ({
    go: go.bind(nav),
    push: push.bind(nav),
    replace: replace.bind(nav),
    createHref: (to) => `#${formatTo(to)}`,
    encodeLocation: (to) => new URL(formatTo(to), 'http://localhost'),
  }), [go, push, replace, nav]);

  // When Mini Apps navigator changes its location, we should actualize the reactive values.
  useEffect(() => {
    return nav.on('change', () => setLocation(createLocation()));
  }, [nav, createLocation]);

  return [location, navigator];
}
