import { pipe } from 'fp-ts/function';

import { BackButton, type BackButtonState } from '@/features/BackButton/BackButton.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';
import { withClickListeners } from '@/fn-options/withClickListeners.js';

/**
 * @internal
 */
export function instantiateBackButton() {
  return new BackButton(pipe(
    sharedFeatureOptions(),
    withVersionBasedPostEvent,
    withStateRestore<BackButtonState>('backButton'),
    withClickListeners('back_button_pressed'),
  ));
}

export const backButton = instantiateBackButton();
