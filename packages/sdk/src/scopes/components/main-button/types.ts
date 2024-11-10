import type { RGB } from '@telegram-apps/bridge';

export interface State {
  backgroundColor?: RGB;
  hasShineEffect: boolean;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  isVisible: boolean;
  text: string;
  textColor?: RGB;
}
