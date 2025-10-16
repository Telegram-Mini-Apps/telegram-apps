import type { PostEventError } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withPostEvent, type WithPostEvent } from '@/fn-options/withPostEvent.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateOptions extends SharedFeatureOptions, WithPostEvent, WithVersion {
}

export type HideKeyboardError = PostEventError;

function create({ postEvent, ...rest }: CreateOptions) {
  return withChecksFp((): E.Either<HideKeyboardError, void> => {
    return postEvent('web_app_hide_keyboard');
  }, { ...rest, returns: 'either', requires: 'web_app_hide_keyboard' });
}

/**
 * Hides the on-screen keyboard, if it is currently visible. Does nothing if the keyboard is
 * not active.
 * @since Mini Apps v9.1
 */
export const hideKeyboardFp = create(pipe(
  sharedFeatureOptions(),
  withPostEvent,
  withVersion,
));

/**
 * @see hideKeyboardFp
 */
export const hideKeyboard = throwifyWithChecksFp(hideKeyboardFp);
