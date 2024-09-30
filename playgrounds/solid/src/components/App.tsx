import { HashRouter, Navigate, Route } from '@solidjs/router';
import { For } from 'solid-js';

import { routes } from '@/navigation/routes.js';
import { IndexPage } from '@/pages/IndexPage/IndexPage.js';

export function App() {
  return (
    <HashRouter>
      <Route path={'/'} component={IndexPage}/>
      <For each={routes}>
        {(route) => <Route path={route.path} component={route.Component}/>}
      </For>
      <Route path="*" component={() => <Navigate href="/"/>}/>
    </HashRouter>
  );
}
