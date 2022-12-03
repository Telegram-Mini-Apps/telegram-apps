import React from 'react';
import {DefaultLayout, WebAppLayout} from '@site/src/components/home';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
  isBrowserEnv,
  isDesktopOrMobileEnv,
  isWindowsPhoneEnv,
} from 'twa-bridge';

/**
 * Index entry for whole documentation.
 * @constructor
 */
export default function Home(): JSX.Element {
  return ExecutionEnvironment.canUseDOM && (
    (isBrowserEnv() && document.referrer.startsWith('https://web.telegram.org/'))
    || isWindowsPhoneEnv(window)
    || isDesktopOrMobileEnv(window)
  )
    // For Web Apps, we render separate layout.
    ? <WebAppLayout/>
    : <DefaultLayout/>;
}
