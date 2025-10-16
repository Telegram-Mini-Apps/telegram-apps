import { pipe } from 'fp-ts/function';
import type * as E from 'fp-ts/Either';
import type { PostEventError } from '@tma.js/bridge';

import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withPostEvent, type WithPostEvent } from '@/fn-options/withPostEvent.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateAddToHomeScreenOptions extends SharedFeatureOptions, WithPostEvent, WithVersion {
}

/**
 * @internal
 */
function createAddToHomeScreen({ postEvent, ...rest }: CreateAddToHomeScreenOptions) {
  return withChecksFp((): E.Either<PostEventError, void> => {
    return postEvent('web_app_add_to_home_screen');
  }, { ...rest, requires: 'web_app_add_to_home_screen', returns: 'either' });
}

/**
 * Prompts the user to add the Mini App to the home screen.
 * @since Mini Apps v8.0
 */
export const addToHomeScreenFp = createAddToHomeScreen(pipe(
  sharedFeatureOptions(),
  withVersion,
  withPostEvent,
));

/**
 * @see addToHomeScreenFp
 */
export const addToHomeScreen = throwifyWithChecksFp(addToHomeScreenFp);
