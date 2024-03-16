import type { Component } from 'solid-js';
import { createMemo, mergeProps } from 'solid-js';

import { useConfig } from '~/hooks/useConfig.js';
import type { ColorScheme, Platform } from '~/types/known.js';
import type { PartialBy } from '~/types/utils.js';

type WithOptionalConfig = Partial<{
  colorScheme: ColorScheme;
  platform: Platform;
}>;

type WithConfigComponent<P extends WithOptionalConfig> =
  Component<PartialBy<P, keyof WithOptionalConfig>>;

/**
 * HOC, which passes current configuration to the wrapped components.
 * @param Component - component to wrap.
 */
export function withConfig<P extends WithOptionalConfig>(
  Component: Component<P>,
): WithConfigComponent<P> {
  const Wrapped: WithConfigComponent<P> = (props) => {
    const { platform, colorScheme } = useConfig();
    const merged = createMemo(() => mergeProps({
      platform: platform(),
      colorScheme: colorScheme(),
    } satisfies Required<WithOptionalConfig>, props) as P & JSX.IntrinsicAttributes);

    return <Component {...merged()}/>;
  };

  Object.defineProperty(Wrapped, 'name', { value: `WithConfig${Component.name}` });

  return Wrapped;
}
