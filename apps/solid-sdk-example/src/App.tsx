import {
  Routes,
  Route,
  RouterIntegration,
  hashIntegration,
  Navigate,
  Router, createIntegration, LocationChange,
} from '@solidjs/router';

import { InitDataPage } from './pages/InitDataPage';
import { ThemeParamsPage } from './pages/ThemeParamsPage';

import { fromLocation, fromHistory } from '@navigation/index';
import { createEffect, createMemo, createSignal } from 'solid-js';
import { navigatorIntegration } from './navigatorIntegration';

// function MainButtonTest() {
//   const { mainButton, backButton } = useSDK();
//
//   const [count, setCount] = createSignal(0);
//
//   onMount(() => {
//     const bb = backButton();
//     const mb = mainButton();
//
//     const onMainButtonClick = () => setCount((count) => count + 1);
//     const onBackButtonClick = () => setCount((count) => count - 1);
//
//     mb.enable().show().on('click', onMainButtonClick);
//     bb.on('click', onBackButtonClick);
//
//     onCleanup(() => {
//       mb.hide().off('click', onMainButtonClick);
//       bb.off('click', onBackButtonClick);
//     });
//   });
//
//   createEffect(() => {
//     mainButton().setText(`Count is ${count()}`);
//   });
//
//   createEffect(() => {
//     const bb = backButton();
//
//     if (count() === 0) {
//       bb.hide();
//       return;
//     }
//     bb.show();
//   });
//
//   return null;
// }
//
// /**
//  * Displays current application init data.
//  */
// function InitData() {
//   const { initData } = useSDK();
//
//   const initDataJson = createMemo(() => {
//     const obj = initData();
//
//     if (!obj) {
//       return 'Init data is empty.';
//     }
//     const { authDate, chat, hash, canSendAfter, queryId, receiver, user, startParam } = obj;
//
//     return JSON.stringify({
//       authDate,
//       chat,
//       hash,
//       canSendAfter,
//       queryId,
//       receiver,
//       user,
//       startParam,
//     }, null, ' ');
//   });
//
//   return (
//     <pre>
//       <code>
//         {initDataJson()}
//       </code>
//     </pre>
//   );
// }

export function App() {
  const navigator =
    fromHistory({ debug: true }) ||
    fromLocation({ debug: true });
  void navigator.attach();

  return (
    <Router source={navigatorIntegration(() => navigator)}>
      <Routes>
        <Route path={'/init-data'} component={InitDataPage}/>
        <Route path={'/theme-params'} component={ThemeParamsPage}/>
        <Route path={'*'} element={<Navigate href={'/theme-params'}/>}/>
      </Routes>
    </Router>
  );
}