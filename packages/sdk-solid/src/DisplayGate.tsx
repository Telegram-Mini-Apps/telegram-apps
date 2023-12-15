import {
  Match,
  Switch,
  type Component,
  type ParentProps,
  type JSX,
} from 'solid-js';

import { useSDKContext } from './provider/index.js';

export interface DisplayGateProps extends ParentProps {
  /**
   * Element or component, which will be displayed in case, SDK is not loading, didn't receive
   * any error during initialization as well as the initialization result.
   */
  initial?: JSX.Element | Component;

  /**
   * Element or component which will be displayed in case, SDK initialization failed.
   */
  error?: JSX.Element | Component<{ error: unknown }>;

  /**
   * Element or component which will be displayed in case, SDK is currently loading.
   */
  loading?: JSX.Element | Component;
}

function render(Component: JSX.Element | Component): JSX.Element;
function render<T extends object>(Component: JSX.Element | Component<T>, props: T): JSX.Element;
function render(Component: JSX.Element | Component, props = {}): JSX.Element {
  return typeof Component === 'function' ? <Component {...props}/> : Component;
}

/**
 * This component is the layer controlling the application display. It displays application in
 * case, the SDK is initialized, displays an error if something went wrong, and a loader
 * if the SDK is warming up.
 */
export function DisplayGate(props: DisplayGateProps) {
  const { loading, error, initResult } = useSDKContext();

  return (
    <Switch fallback={render(props.initial)}>
      <Match when={initResult()}>
        {props.children}
      </Match>
      <Match when={error()}>
        {render(props.error, { error: error() })}
      </Match>
      <Match when={loading()}>
        {render(props.loading)}
      </Match>
    </Switch>
  );
}