import type { HasUndefined, If } from '@tma.js/util-types';
import type { ThemeParams } from '@tma.js/theme-params';

import type { StateEvents } from '../../state/index.js';

export type ThemeParamsState = {
  [K in keyof ThemeParams]-?: If<
    HasUndefined<ThemeParams[K]>,
    Exclude<ThemeParams[K], undefined> | null,
    ThemeParams[K]
  >;
};

export type ThemeParamsEvents = StateEvents<ThemeParamsState>;

export type ThemeParamsEventName = keyof ThemeParamsEvents;

export type ThemeParamsEventListener<E extends ThemeParamsEventName> = ThemeParamsEvents[E];
