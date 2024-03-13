import type { RGB } from '../../colors/types.js';
import type { StateEvents } from '../../state/types.js';

export type ThemeParamsKey =
  | 'accentTextColor'
  | 'backgroundColor'
  | 'buttonColor'
  | 'buttonTextColor'
  | 'destructiveTextColor'
  | 'headerBackgroundColor'
  | 'hintColor'
  | 'linkColor'
  | 'secondaryBackgroundColor'
  | 'sectionBackgroundColor'
  | 'sectionHeaderTextColor'
  | 'subtitleTextColor'
  | 'textColor';

/**
 * Application [theme parameters](https://docs.telegram-mini-apps.com/platform/theming).
 * Defines palette used by the Telegram application.
 */
export interface ThemeParamsParsed {
  [key: ThemeParamsKey | string]: RGB | undefined;
}

export type ThemeParamsState = ThemeParamsParsed;

export type ThemeParamsEvents = StateEvents<ThemeParamsState>;

export type ThemeParamsEventName = keyof ThemeParamsEvents;

export type ThemeParamsEventListener<E extends ThemeParamsEventName> = ThemeParamsEvents[E];
