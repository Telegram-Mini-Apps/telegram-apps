import {
  createMemo,
  Switch,
  Match,
  type ParentProps,
} from 'solid-js';
import { SDKProvider, useSDKContext } from '@tma.js/sdk-solid';
import { App } from './App';

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
        <div>Loading..</div>
      </Match>
    </Switch>
  );
}

/**
 * Root component of the project.
 */
export function Root() {
  return (
    <SDKProvider initOptions={{ debug: true, cssVars: true, timeout: 1000 }}>
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
}