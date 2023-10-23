import {
  Routes,
  Route,
  Navigate,
  Router,
} from '@solidjs/router';
import { createIntegration } from '@tma.js/solid-router-integration';
import { fromLocation, fromHistory } from '@tma.js/navigation';

import { InitDataPage } from './pages/InitDataPage';
import { ThemeParamsPage } from './pages/ThemeParamsPage';

export function App() {
  // We should create navigator to pass it to integration creation. First of all, we are
  // trying to recreate from current browser history due to the reason, current page could be
  // just reloaded. In this case, navigator will restore its latest state.
  // If restoration was unsuccessful, we are creating navigator from the current browser location.
  // FIXME: Restoration will not work in Telegram Web as long as web version recreates whole
  //  iframe breaking browser history. We should restore from the sessionStorage then.
  //  Issue: https://github.com/Telegram-Mini-Apps/tma.js/issues/150
  const navigator =
    fromHistory({ debug: true }) ||
    fromLocation({ debug: true });

  // Then, to allow this navigator update current browser history, we should attach it. Otherwise,
  // it will work in memory mode.
  void navigator.attach();

  return (
    <Router source={createIntegration(() => navigator)}>
      <Routes>
        <Route path={'/init-data'} component={InitDataPage}/>
        <Route path={'/theme-params'} component={ThemeParamsPage}/>
        <Route path={'*'} element={<Navigate href={'/init-data'}/>}/>
      </Routes>
    </Router>
  );
}