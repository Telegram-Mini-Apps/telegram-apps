import type { RGB } from './colors.js';

export type ThemeParamsKey =
  | 'accentTextColor'
  | 'bgColor'
  | 'buttonColor'
  | 'buttonTextColor'
  | 'bottomBarBgColor'
  | 'destructiveTextColor'
  | 'headerBgColor'
  | 'hintColor'
  | 'linkColor'
  | 'secondaryBgColor'
  | 'sectionBgColor'
  | 'sectionHeaderTextColor'
  | 'sectionSeparatorColor'
  | 'subtitleTextColor'
  | 'textColor';

/**
 * Application [theme parameters](https://docs.telegram-mini-apps.com/platform/theming).
 * Defines palette used by the Telegram application.
 */
export interface ThemeParams {
  [key: ThemeParamsKey | string]: RGB | undefined;
}
