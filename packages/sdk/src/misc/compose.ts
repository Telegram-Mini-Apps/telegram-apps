interface ComposeFn {
  (): void;
}

interface Compose {
  /**
   * Calls all collected functions resetting the collector stote.
   */
  (): void;

  /**
   * Adds new functions to call on Compose call.
   * @param fns
   */
  // add(...fns: ComposeFn[]): void;
}

/**
 * Creates new cleanup functions collector.
 */
export function compose(...fns: ComposeFn[]): Compose {
  let listeners = fns;

  const result: Compose = () => {
    listeners.forEach((l) => l());
    listeners = [];
  };
  // result.add = listeners.push.bind(listeners);
  return result;
}
