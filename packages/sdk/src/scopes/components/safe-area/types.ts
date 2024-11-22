import { SafeAreaInset } from "@telegram-apps/bridge";

export interface State {
  inset: SafeAreaInset;
  contentInset: SafeAreaInset;
}

export interface GetCSSVarNameFn {
  /**
   * @param property - safe area insets
   * @returns Computed complete CSS variable name.
   */
  (property: Extract<keyof SafeAreaInset, string>): string;
}