import { createMemo, Switch, Match, ParentProps } from 'solid-js';
import { SDKProvider, useSDK, useSDKContext } from '@twa.js/sdk-solid';

/**
 * Displays current application init data.
 */
function InitData() {
  const { initData } = useSDK();

  const initDataJson = createMemo(() => {
    const obj = initData();

    if (!obj) {
      return 'Init data is empty.';
    }
    const { authDate, chat, hash, canSendAfter, queryId, receiver, user, startParam } = obj;

    return JSON.stringify({
      authDate,
      chat,
      hash,
      canSendAfter,
      queryId,
      receiver,
      user,
      startParam,
    }, null, ' ');
  });

  return (
    <pre>
      <code>
        {initDataJson()}
      </code>
    </pre>
  );
}

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
    <SDKProvider initOptions={{ debug: true }}>
      <DisplayGate>
        <InitData/>
      </DisplayGate>
    </SDKProvider>
  );
}