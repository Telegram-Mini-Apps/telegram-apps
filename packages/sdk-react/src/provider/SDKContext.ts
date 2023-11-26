import { createContext } from 'react';

import type { SDKContextType } from './types.js';

export const SDKContext = createContext<SDKContextType>({
  loading: false,
});

SDKContext.displayName = 'SDKContext';
