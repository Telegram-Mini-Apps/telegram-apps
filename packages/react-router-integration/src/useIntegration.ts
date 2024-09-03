import { useMemo } from 'react';
import { type Navigator, createSafeURL, urlToPath } from '@telegram-apps/navigation';
import { useSignal } from '@telegram-apps/react-signals';
import type {
  Location as RouterLocation,
  Navigator as RouterNavigator,
  To,
  NavigateOptions,
} from 'react-router-dom';

/**
 * Uses the passed Mini Apps navigator and returns a tuple containing reactive values
 * representing current location and react-router-dom navigator.
 * @param nav - Mini Apps navigator.
 */
export function useIntegration<State>(nav: Navigator<State>): [
  RouterLocation<State>,
  RouterNavigator
] {
  const [location] = useSignal(nav.location);

  return [
    useMemo(() => ({
      ...location,
      state: location.state as State,
      key: location.id,
    }), [location]),
    useMemo(() => {
      function navigate(to: To, state?: State, options?: NavigateOptions) {
        options ||= {};
        if (state === undefined) {
          state = options.state;
        }
        const path = urlToPath(to);
        if (options.replace) {
          nav.replace(path, state);
        } else {
          nav.push(path, state);
        }
      }

      return {
        go: nav.go,
        push: navigate,
        replace: navigate,
        createHref: (to) => nav.renderPath(urlToPath(to)),
        encodeLocation: (to) => createSafeURL(nav.renderPath(urlToPath(to))),
      };
    }, [nav]),
  ];
}
