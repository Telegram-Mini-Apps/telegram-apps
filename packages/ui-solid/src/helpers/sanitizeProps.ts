import { splitProps } from 'solid-js';

/**
 * Removes specified properties.
 * @param props - properties.
 * @param keys - keys to remove.
 */
export function sanitizeProps<Props extends Record<any, any>, Key extends keyof Props>(
  props: Props,
  ...keys: Key[]
): { [P in keyof Props as Exclude<P, Key>]: Props[P]; } {
  return splitProps(props, keys)[1];
}
