import { mergeProps } from 'solid-js';
import type { MergeProps } from 'solid-js';

import { useConfig } from '~/hooks/useConfig.js';
import type { Config } from '~/providers/ConfigProvider/ConfigProvider.context.js';

/**
 * Merges specified properties with a config from the config provider.
 * @param props - properties to merge.
 */
export function mergeWithConfig<P extends any[]>(...props: P): MergeProps<[Config, ...P]> {
  return mergeProps(useConfig(), ...props);
}
