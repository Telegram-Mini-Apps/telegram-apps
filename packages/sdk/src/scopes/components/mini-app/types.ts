import type { HeaderColorKey, RGB } from '@telegram-apps/bridge';

/**
 * Mini App header color.
 */
export type HeaderColor = HeaderColorKey | RGB;

export interface State {
  backgroundColor: RGB;
  headerColor: HeaderColor;
}

export interface GetCssVarNameFn {
  /**
   * @param property - mini app property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'bgColor' | 'bottomBarColor' | 'headerColor'): string;
}
