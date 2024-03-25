import { mergeProps } from 'solid-js';
import type { Component, JSX } from 'solid-js';

import { useConfig } from '~/hooks/useConfig.js';
import type { Config } from '~/providers/ConfigProvider/ConfigProvider.context.js';
import type { PartialBy } from '~/types/utils.js';

type WithOptionalConfig = Partial<Config>;

export type WithConfigComponent<P extends WithOptionalConfig> =
  Component<PartialBy<P, keyof WithOptionalConfig>>;

/**
 * HOC, which passes current configuration to the wrapped components.
 * @param Component - component to wrap.
 */
export function withConfig<P extends Partial<Config>>(
  Component: Component<P>,
): WithConfigComponent<P> {
  return (props) => {
    return <Component {...mergeProps(useConfig(), props) as P & JSX.IntrinsicAttributes}/>;
  };
}
