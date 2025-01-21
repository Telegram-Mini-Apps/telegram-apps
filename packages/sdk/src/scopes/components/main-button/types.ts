import type { RGB } from '@telegram-apps/types';

export interface State {
  backgroundColor?: RGB;
  hasShineEffect: boolean;
  isEnabled: boolean;
  isLoaderVisible: boolean;
  isVisible: boolean;
  text: string;
  textColor?: RGB;
}
