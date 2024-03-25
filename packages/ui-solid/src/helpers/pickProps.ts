import { type SplitProps, splitProps } from 'solid-js';

export type PickResult<Props, Key extends keyof Props> = SplitProps<Props, [[Key]]>[0];

/**
 * Safely picked specifies props saving their reactivity.
 * @param props - properties.
 * @param keys - keys to pick.
 */
export function pickProps<Props extends Record<any, any>, Keys extends keyof Props>(
  props: Props,
  keys: readonly Keys[],
): PickResult<Props, Keys> {
  return splitProps(props, keys)[0];
}
