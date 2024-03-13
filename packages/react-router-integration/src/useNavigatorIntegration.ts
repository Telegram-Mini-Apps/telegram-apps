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
  // Creates location based on the Mini Apps navigator.
  const createLocation = useCallback(() => ({
    state: null,
    key: '',
    pathname: nav.pathname,
    hash: nav.hash,
    search: nav.search,
  }), [nav]);

  const [location, setLocation] = useState(createLocation);

  // Create Navigator appropriate to the react-router-dom package.
  const navigator = useMemo<Navigator>(() => ({
    go: nav.go.bind(nav),
    push: nav.push.bind(nav),
    replace: nav.replace.bind(nav),
    createHref: (to) => `#${formatTo(to)}`,
    encodeLocation: (to) => new URL(formatTo(to), 'http://localhost'),
  }), [nav]);

  // When Mini Apps navigator changes its location, we should actualize the reactive values.
  useEffect(() => {
    return nav.on('change', () => setLocation(createLocation()));
  }, [nav, createLocation]);

  return [location, navigator];
}
