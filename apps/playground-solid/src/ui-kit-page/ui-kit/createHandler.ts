import { Accessor, createMemo, JSX } from 'solid-js';

type Extension<F> = F extends JSX.EventHandler<any, any>
  ? (...args: Parameters<F>) => void
  : F extends JSX.BoundEventHandler<any, any>
    ? (e: Parameters<F[0]>[1]) => void
    : never;

type ExtendedHandler<F> = F extends JSX.EventHandlerUnion<infer A, infer B>
  ? (...args: Parameters<JSX.EventHandler<A, B>>) => void
  : never;

export function createHandler<F extends JSX.EventHandlerUnion<any, any>>(
  handler: Accessor<F | undefined>,
  extension: Extension<F>,
): Accessor<ExtendedHandler<F>> {
  const extended = createMemo<ExtendedHandler<F>>(() => {
    const original = handler();

    return ((...args) => {
      extension(...args);

      if (typeof original === 'function') {
        original(...args);
      }
    }) as ExtendedHandler<F>;
  });

  return extended;
}