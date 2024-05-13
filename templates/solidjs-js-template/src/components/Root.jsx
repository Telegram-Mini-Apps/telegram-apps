import { retrieveLaunchParams, SDKProvider } from '@tma.js/sdk-solid';
import { ErrorBoundary, Switch, Match } from 'solid-js';

import { App } from '@/components/App.jsx';
import { TonConnectUIProvider } from '@/tonconnect/TonConnectUIProvider.jsx';

/**
 * @returns {Node | JSX.ArrayElement | string | number | boolean}
 */
function Inner() {
  const debug = retrieveLaunchParams().startParam === 'debug';
  if (debug) {
    import('eruda').then((lib) => lib.default.init());
  }

  return (
    <TonConnectUIProvider
      manifestUrl={new URL('tonconnect-manifest.json', window.location.href).toString()}
    >
      <SDKProvider acceptCustomStyles={true} debug={debug}>
        <App/>
      </SDKProvider>
    </TonConnectUIProvider>
  );
};

/**
 * @returns {Node | JSX.ArrayElement | string | number | boolean}
 */
export function Root() {
  return (
    <ErrorBoundary
      fallback={err => {
        console.error('ErrorBoundary handled error:', err);

        return (
          <div>
            <p>ErrorBoundary handled error:</p>
            <blockquote>
              <code>
                <Switch fallback={JSON.stringify(err)}>
                  <Match when={typeof err === 'string' ? err : false}>
                    {v => v()}
                  </Match>
                  <Match when={err instanceof Error ? err.message : false}>
                    {v => v()}
                  </Match>
                </Switch>
              </code>
            </blockquote>
          </div>
        );
      }}
    >
      <Inner/>
    </ErrorBoundary>
  );
};
