import { createContext, useContext } from 'solid-js';
import { ConfigContextType } from './types';

export const ConfigContext = createContext<ConfigContextType>(undefined, { name: 'ConfigContext' });

export function useConfigContext(): ConfigContextType {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfigContext was used outside of provider.')
  }

  return context;
}