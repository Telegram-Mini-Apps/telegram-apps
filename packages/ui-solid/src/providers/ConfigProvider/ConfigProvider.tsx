import type { Component, ParentProps } from 'solid-js';

import { pickProps } from '~/helpers/pickProps.js';
import type { ColorScheme, Platform } from '~/types/known.js';

import { ConfigContext } from './ConfigProvider.context.js';

export type ConfigProviderProps = ParentProps<{
  /**
   * Current color scheme.
   */
  colorScheme: ColorScheme;
  /**
   * Identifier of the current platform.
   */
  platform: Platform;
}>;

export const ConfigProvider: Component<ConfigProviderProps> = (props) => {
  return (
    <ConfigContext.Provider value={pickProps(props, ['colorScheme', 'platform'])}>
      {props.children}
    </ConfigContext.Provider>
  );
};
