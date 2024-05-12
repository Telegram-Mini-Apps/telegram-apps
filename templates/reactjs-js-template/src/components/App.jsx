import { useIntegration } from '@tma.js/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@tma.js/sdk-react';
import { useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';

import { routes } from '@/navigation/routes.jsx';

/**
 * @return {JSX.Element}
 */
export function App() {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (viewport) {
      return bindViewportCSSVars(viewport);
    }
  }, [viewport]);

  // Create new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator(
    'app-navigation-state',
    { hashMode: 'default' },
  ), []);
  const [location, reactNavigator] = useIntegration(navigator);

  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <Router location={location} navigator={reactNavigator}>
      <Routes>
        {routes.map((route) => <Route key={route.path} {...route} />)}
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </Router>
  );
}
