import type { HeaderColorKey, BottomBarColor, BackgroundColor } from '@telegram-apps/bridge';
import type { RGB } from '@telegram-apps/types';

/**
 * Mini App header color.
 */
export type HeaderColor = HeaderColorKey | RGB;

export interface State {
  backgroundColor: BackgroundColor;
  bottomBarColor: BottomBarColor;
  headerColor: HeaderColor;
  isActive: boolean;
}

export interface GetCssVarNameFn {
  /**
   * @param property - mini app property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'bgColor' | 'bottomBarColor' | 'headerColor'): string;
}
