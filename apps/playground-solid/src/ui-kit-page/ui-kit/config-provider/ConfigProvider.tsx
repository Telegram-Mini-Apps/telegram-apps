import { createMemo, ParentProps } from 'solid-js';
import { Platform } from '@twa.js/sdk';

import { ConfigContext } from './context';

export type ConfigProviderProps = ParentProps<{
  platform: string
}>;

export function ConfigProvider(props: ConfigProviderProps) {
  const platform = createMemo(() => props.platform);

  return (
    <ConfigContext.Provider value={{ platform }}>{props.children}</ConfigContext.Provider>
  );
}