import {
  BackButton,
  HapticFeedback,
  InitData,
  MainButton, Popup, ThemeParams, Viewport, WebApp,
} from 'twa-sdk';
import {Bridge} from 'twa-bridge';

/**
 * List of provided SDK components.
 */
export interface SDKComponents {
  backButton: BackButton;
  bridge: Bridge;
  haptic: HapticFeedback;
  initData: InitData;
  mainButton: MainButton;
  popup: Popup;
  theme: ThemeParams;
  viewport: Viewport;
  webApp: WebApp;
}

/**
 * Known SDK component name.
 */
export type SDKComponentName = keyof SDKComponents;

/**
 * Returns SDK component type by its name.
 */
export type SDKComponent<N extends SDKComponentName> = SDKComponents[N];

export interface SDKContext {
  /**
   * States, that SDK called `init()` method.
   */
  didInit: boolean;

  /**
   * Components ready to use. This value will be null until initialization
   * is done.
   */
  components: SDKComponents | null;
}