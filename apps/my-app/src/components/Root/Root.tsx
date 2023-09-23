import { createMemo, Match, Switch, type ParentProps, createEffect } from 'solid-js';
import { postEvent } from '@twa.js/bridge';
import { retrieveLaunchParams } from '@twa.js/sdk';
import { SDKProvider, useSDKContext } from '@twa.js/sdk-solid';
import { isColorDark } from '@twa.js/colors';

import { App } from '../App/index.js';
import { Spinner } from '../../package-ui/index.js';

import styles from './styles.module.scss';

/**
 * Component which is responsible for controlling SDK init process.
 */
function DisplayGate(props: ParentProps) {
  const { loading, error } = useSDKContext();
  const errorMessage = createMemo<null | string>(() => {
    const err = error();

    if (!err) {
      return null;
    }

    return err instanceof Error ? err.message : 'Unknown error';
  });

  return (
    <Switch fallback={props.children}>
      <Match when={errorMessage()}>
        <p>
          SDK was unable to initialize. Probably, current application is being used
          not in Telegram Web Apps environment.
        </p>
        <blockquote>
          <p>{errorMessage()}</p>
        </blockquote>
      </Match>
      <Match when={loading()}>
        <Spinner class={styles.loading} size={40}/>
      </Match>
    </Switch>
  );
}

/**
 * Root component of the project.
 */
export function Root() {
  createEffect(() => {
    // Expand application when it was loaded.
    postEvent('web_app_expand');

    // Set current scheme.
    const { themeParams: { backgroundColor } } = retrieveLaunchParams();
    const scheme = backgroundColor && isColorDark(backgroundColor) ? 'dark' : 'light';

    document.documentElement.setAttribute('color-scheme', scheme);
    postEvent('web_app_set_background_color', { color: scheme === 'dark' ? '#000' : '#F2F2F7' });
  });

  return (
    <SDKProvider initOptions={{ debug: true }}>
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}