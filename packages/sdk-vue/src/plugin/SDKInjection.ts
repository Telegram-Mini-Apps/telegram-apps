import type { InjectionKey } from 'vue';

import type { SDKContextType } from './types.js';

export const SDKInjection: InjectionKey<SDKContextType> = Symbol('SDKInjection');
