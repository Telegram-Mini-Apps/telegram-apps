import { createContext } from 'react';

import type { SDKContextType } from './types.js';

export const SDKContext = createContext<SDKContextType>({
  error: null,
  initResult: null,
  loading: false,
});

SDKContext.displayName = 'SDKContext';
