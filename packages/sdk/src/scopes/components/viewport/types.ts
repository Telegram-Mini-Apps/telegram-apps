export interface State {
  height: number;
  isExpanded: boolean;
  stableHeight: number;
  width: number;
}

export interface GetCSSVarNameFn {
  /**
   * @param property - viewport property.
   * @returns Computed complete CSS variable name.
   */
  (property: 'width' | 'height' | 'stableHeight'): string;
}
