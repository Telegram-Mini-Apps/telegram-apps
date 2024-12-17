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

export type GetCSSVarNameFn = (key: GetCSSVarNameKey) => string | null | undefined | false;
