import { pipe } from 'fp-ts/function';

import { BackButton, type BackButtonState } from '@/features/BackButton/BackButton.js';
import {
  withStateRestore,
  sharedFeatureOptions,
  withVersionedBasedPostEvent,
  withClickListeners,
} from '@/features/mixins.js';

/**
 * @internal
 */
export function instantiateBackButton() {
  return new BackButton(pipe(
    sharedFeatureOptions(),
    withVersionedBasedPostEvent,
    withStateRestore<BackButtonState>('backButton'),
    withClickListeners('back_button_pressed'),
  ));
}

export const backButton = instantiateBackButton();
