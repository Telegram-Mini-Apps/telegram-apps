import { pipe } from 'fp-ts/function';

import {
  SettingsButton,
  type SettingsButtonState,
} from '@/features/SettingsButton/SettingsButton.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withClickListeners } from '@/fn-options/withClickListeners.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';

/**
 * @internal
 */
export function instantiateSettingsButton() {
  return new SettingsButton(pipe(
    sharedFeatureOptions(),
    withClickListeners('settings_button_pressed'),
    withVersionBasedPostEvent,
    withStateRestore<SettingsButtonState>('settingsButton'),
  ));
}

export const settingsButton = instantiateSettingsButton();
