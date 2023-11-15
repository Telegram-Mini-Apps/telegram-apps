import type { ThemeParams } from '@tma.js/theme-params';

import type { StateEvents } from '../../state/index.js';

export type ThemeParamsState = ThemeParams;

export type ThemeParamsEvents = StateEvents<ThemeParamsState>;

export type ThemeParamsEventName = keyof ThemeParamsEvents;

export type ThemeParamsEventListener<E extends ThemeParamsEventName> = ThemeParamsEvents[E];
