import type { SafeAreaInsets } from '@telegram-apps/bridge';

export interface State {
  contentSafeAreaInsets: SafeAreaInsets;
  height: number;
  isExpanded: boolean;
  isFullscreen: boolean;
  safeAreaInsets: SafeAreaInsets;
  stableHeight: number;
  width: number;
}

type SafeAreaInsetCSSVarKey = `safeAreaInset${Capitalize<keyof SafeAreaInsets>}`;

export type GetCSSVarNameKey =
  | 'width'
  | 'height'
  | 'stableHeight'
  | SafeAreaInsetCSSVarKey
  | `content${Capitalize<SafeAreaInsetCSSVarKey>}`

export interface GetCSSVarNameFn {
  /**
   * @param key - viewport property.
   * @returns Computed complete CSS variable name. The CSS variable will only be defined if the
   * function returned string non-empty value.
   */
  (key: GetCSSVarNameKey): string | null | undefined | false;
}
