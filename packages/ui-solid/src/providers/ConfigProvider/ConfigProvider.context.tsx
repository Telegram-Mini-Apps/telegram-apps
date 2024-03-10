import {
  createContext,
  createMemo,
  mergeProps,
  useContext,
} from 'solid-js';
import type { Accessor, Component, JSX } from 'solid-js';

import type { ColorScheme, FlattenAccessors, PartialBy, Platform } from '~types';

type WithOptionalConfig = Partial<FlattenAccessors<Config>>;
type WithConfigComponent<P extends WithOptionalConfig> = Component<PartialBy<P, keyof Config>>;

export interface Config {
  /**
   * Current color scheme.
   */
  colorScheme: Accessor<ColorScheme>;

  /**
   * Identifier of the current platform.
   */
  platform: Accessor<Platform>;
}

export const ConfigContext = createContext<Config>({
  platform: () => 'base' as const,
  colorScheme: () => 'light' as const,
});

/**
 * Hooks, which returns project configuration.
 */
export function useConfig(): Config {
  return useContext(ConfigContext);
}

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
    }, props) as P & JSX.IntrinsicAttributes);

    return <Component {...merged()}/>;
  };

  Object.defineProperty(Wrapped, 'name', { value: `WithConfig${Component.name}` });

  return Wrapped;
}
