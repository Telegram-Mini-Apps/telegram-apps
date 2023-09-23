import { Accessor, createMemo, JSX } from 'solid-js';

export type HandlerExtension<F> = F extends JSX.EventHandler<any, any>
  ? (...args: Parameters<F>) => void
  : F extends JSX.BoundEventHandler<any, any>
    ? (e: Parameters<F[0]>[1]) => void
    : never;

export type ExtendedHandler<F> = F extends JSX.EventHandlerUnion<infer A, infer B>
  ? (...args: Parameters<JSX.EventHandler<A, B>>) => void
  : never;

export type ExtendableHandler = JSX.EventHandlerUnion<any, any>;

/**
 * Wraps passed handler with specified extension function. This function is usually used when
 * developer wants to extend native handler passed from parent via props.
 * @param getHandler - original handler accessor.
 * @param getExtension - handler extension accessor.
 */
export function createHandler<F extends ExtendableHandler>(
  getHandler: Accessor<F | undefined>,
  getExtension: Accessor<HandlerExtension<F>>,
): Accessor<ExtendedHandler<F>> {
  const extended = createMemo<ExtendedHandler<F>>(() => {
    const handler = getHandler();
    const extension = getExtension();

    return ((...args) => {
      extension(...args);

      if (typeof handler === 'function') {
        handler(...args);
      }
    }) as ExtendedHandler<F>;
  });

  return extended;
}