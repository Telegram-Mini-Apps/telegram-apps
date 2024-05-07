import { useMemo, useReducer } from 'react';

interface AnyFn {
  (...args: any): any;
}

type State<Fn extends AnyFn> = {
  loading: boolean,
  data?: Awaited<ReturnType<Fn>>,
  error?: unknown
};

type Action<Fn extends AnyFn> =
  | { type: 'start' }
  | { type: 'error', error: unknown }
  | { type: 'completed', data: Awaited<ReturnType<Fn>> };

export function useFn<Fn extends AnyFn>(fn: Fn): State<Fn> {
  const [
    state,
    dispatch,
  ] = useReducer((_: State<Fn>, action: Action<Fn>) => {
    if (action.type === 'start') {
      return { loading: true };
    }
    if (action.type === 'error') {
      return { loading: false, error: action.error };
    }
    if (action.type === 'completed') {
      return { loading: false, data: action.data };
    }
    return { loading: false };
  }, { loading: false });

  useMemo(() => {
    try {
      const value = fn();
      if (value instanceof Promise) {
        dispatch({ type: 'start' });
        value
          .then((result) => dispatch({ type: 'completed', data: result }))
          .catch((e) => dispatch({ type: 'error', error: e }));
      } else {
        dispatch({ type: 'completed', data: value });
      }
    } catch (e) {
      dispatch({ type: 'error', error: e });
    }
  }, []);

  return state;
}
