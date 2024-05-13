import { Navigate, Route } from '@solidjs/router';
import {
  initNavigator,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@tma.js/sdk-solid';
import { createRouter } from '@tma.js/solid-router-integration';
import { createEffect, For, onCleanup } from 'solid-js';

import { routes } from '@/navigation/routes.jsx';

/**
 * @returns {Node | JSX.ArrayElement | string | number | boolean}
 */
export function App() {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  createEffect(() => {
    onCleanup(bindMiniAppCSSVars(miniApp(), themeParams()));
  });
  createEffect(() => {
    onCleanup(bindThemeParamsCSSVars(themeParams()));
  });
  createEffect(() => {
    const vp = viewport();
    if (vp) {
      onCleanup(bindViewportCSSVars(vp));
    }
  });

  // Create new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = initNavigator('app-navigator-state', { hashMode: 'default' });
  void navigator.attach();

  onCleanup(() => {
    navigator.detach();
  });

  const Router = createRouter(navigator);

  return (
    <Router>
      <For each={routes}>
        {(route) => <Route path={route.path} component={route.Component}/>}
      </For>
      <Route path='*' component={() => <Navigate href='/'/>}/>
    </Router>
  );
}
