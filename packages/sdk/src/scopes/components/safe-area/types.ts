import { SafeAreaInset } from "@telegram-apps/bridge";

export interface State {
  inset: SafeAreaInset;
  contentInset: SafeAreaInset;
}

type Component = "safeArea" | "contentSafeArea";

export interface GetCSSVarNameFn {
  /**
   * @param component - safe area or content safe area component
   * @param property - safe area insets property
   * @returns Computed complete CSS variable name.
   */
  (component: Component, property: Extract<keyof SafeAreaInset, string>): string;
}