import type { HasUndefined, If } from '@twa.js/util-types';

import type { ThemeParamsType } from '../../theme-params.js';
import type { StateEvents } from '../../state/index.js';

export type ThemeParamsState = {
  [K in keyof ThemeParamsType]-?: If<
    HasUndefined<ThemeParamsType[K]>,
    Exclude<ThemeParamsType[K], undefined> | null,
    ThemeParamsType[K]
  >;
};

export type ThemeParamsEvents = StateEvents<ThemeParamsState>;

export type ThemeParamsEventName = keyof ThemeParamsEvents;

export type ThemeParamsEventListener<E extends ThemeParamsEventName> = ThemeParamsEvents[E];
