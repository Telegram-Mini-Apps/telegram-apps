import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import type { ButtonOptions } from '@/composables/Button.js';

export interface BackButtonState {
  isVisible: boolean;
}

export interface BackButtonOptions extends WithVersionBasedPostEvent,
  SharedFeatureOptions,
  Omit<ButtonOptions<BackButtonState>, 'onChange' | 'initialState'> {
}
