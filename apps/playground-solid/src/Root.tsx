import { Component, createMemo, Switch, Match, ParentProps, JSXElement } from 'solid-js';
import { SDKProvider, useSDK, useSDKContext } from '@twa.js/sdk-solid';

function App() {
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

function DisplayGate(props: ParentProps) {
  const { loading, error } = useSDKContext();
  const errorMessage = createMemo(() => {
    const err = error();

    if (!err) {
      return null;
    }

    return err instanceof Error ? err.message : 'Unknown error';
  });

  return (
    <Switch fallback={props.children}>
      <Match when={errorMessage()}>
        <div>An error occurred: {errorMessage()}</div>
      </Match>
      <Match when={loading()}>
        <div>Loading..</div>
      </Match>
    </Switch>
  );
}

export const Root: Component = () => {
  return (
    <SDKProvider initOptions={{ debug: true }}>
      <DisplayGate>
        <App/>
      </DisplayGate>
    </SDKProvider>
  );
};