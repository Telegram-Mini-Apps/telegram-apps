import { type SplitProps, splitProps } from 'solid-js';

export type SanitizeResult<Props, Key extends keyof Props> = SplitProps<Props, [[Key]]>[1];

export function createSanitizer<HocKey extends string>(sanitizeKeys: HocKey[]) {
  function sanitizer<Props extends Partial<Record<HocKey, any>>>(
    props: Props,
  ): SanitizeResult<Props, HocKey>;

  function sanitizer<
    Props extends Partial<Record<HocKey, any>>,
    Keys extends keyof Props,
  >(
    props: Props,
    keys: readonly Keys[],
  ): SanitizeResult<Props, Keys | HocKey>;

  function sanitizer(props: Record<HocKey, any>, keys: readonly HocKey[] = []) {
    return splitProps(props, [...keys, ...sanitizeKeys])[1];
  }

  return sanitizer;
}
