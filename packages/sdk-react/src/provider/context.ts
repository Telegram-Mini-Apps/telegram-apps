import { createContext } from 'react';

import type { SDKContext } from './types';

export const sdkContext = createContext<SDKContext>({
  components: null,
  didInit: false,
  error: null,
});

sdkContext.displayName = 'SDKContext';
