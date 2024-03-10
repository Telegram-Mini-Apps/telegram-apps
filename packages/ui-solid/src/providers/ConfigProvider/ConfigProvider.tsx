import { isColorDark, retrieveLaunchParams } from '@tma.js/sdk';
import { createMemo } from 'solid-js';
import type { ParentProps, Component } from 'solid-js';

import { ConfigContext } from './ConfigProvider.context.js';

import type { ColorScheme, Platform } from '~types';

export type ConfigProviderProps = ParentProps<{
  /**
   * Current color scheme.
   * @default Value, computed based on launch parameters theme information.
   */
  colorScheme?: ColorScheme;

  /**
   * Identifier of the current platform.
   * @default Value, computed based on launch parameters platform.
   */
  platform?: Platform;
}>;

export const ConfigProvider: Component<ConfigProviderProps> = (props) => {
  const colorScheme = createMemo<ColorScheme>(() => {
    return props.colorScheme || (
      isColorDark(retrieveLaunchParams().themeParams.backgroundColor || '#ffffff')
        ? 'dark'
        : 'light'
    );
  });

  const platform = createMemo<Platform>(() => {
    return props.platform || (
      ['macos', 'ios'].includes(retrieveLaunchParams().platform)
        ? 'ios'
        : 'base'
    );
  });

  return (
    <ConfigContext.Provider value={{ colorScheme, platform }}>
      {props.children}
    </ConfigContext.Provider>
  );
};
