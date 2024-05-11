import type { StringKeys } from '@/types/utils.js';

/**
 * Creates a map with all events emitted by BaseComponent.
 * @example
 * ```ts
 * type A = StateEvents<{
 *   name: string;
 *   age: number;
 *   isRegistered: boolean;
 * }>;
 *
 * // Will be:
 * {
 *   "change:name": (currentValue: string) => void;
 *   "change:age": (currentValue: number) => void;
 *   "change:isRegistered": (currentValue: boolean) => void;
 *   "change": () => void;
 * }
 * ```
 */
export type StateEvents<State extends object> = {
  [Event in `change:${StringKeys<State>}`]: (
    currentValue: Event extends `change:${infer T extends StringKeys<State>}`
      ? State[T]
      : never,
  ) => void;
} & {
  /**
   * Something has changed in the state.
   */
  change: (currentState: State) => void;
};
