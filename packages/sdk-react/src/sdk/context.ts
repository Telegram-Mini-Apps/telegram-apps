import {createContext} from 'react';
import {SDKContext} from './types';

export const sdkContext = createContext<SDKContext>({
  components: null,
  didInit: false,
});

sdkContext.displayName = 'SDKContext';