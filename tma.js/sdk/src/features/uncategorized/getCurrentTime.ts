import { date, integer, number, transform, pipe as valiPipe, safeParse } from 'valibot';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { withChecksFp } from '@/wrappers/withChecksFp.js';
import {
  type SharedFeatureOptions,
  sharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import {
  type WithInvokeCustomMethod,
  withInvokeCustomMethod,
  type InvokeCustomMethodError,
} from '@/fn-options/withInvokeCustomMethod.js';
import { type WithVersion, withVersion } from '@/fn-options/withVersion.js';
import type { AsyncOptions } from '@/types.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import { ValidationError } from '@/errors.js';

interface CreateOptions extends SharedFeatureOptions, WithInvokeCustomMethod, WithVersion {
}

export type GetCurrentTimeError = InvokeCustomMethodError | ValidationError;

function create({ invokeCustomMethod, ...rest }: CreateOptions) {
  return withChecksFp((options?: AsyncOptions): TE.TaskEither<GetCurrentTimeError, Date> => {
    return pipe(
      invokeCustomMethod('getCurrentTime', {}, options),
      TE.chain(response => {
        const parsed = safeParse(
          valiPipe(number(), integer(), transform(v => new Date(v * 1000)), date()),
          response,
        );
        return parsed.success
          ? TE.right(parsed.output)
          : TE.left(new ValidationError(response, parsed.issues));
      }),
    );
  }, { ...rest, isSupported: 'web_app_invoke_custom_method', returns: 'task' });
}

/**
 * @returns The current time according to the Telegram server time.
 * @param options - additional options.
 * @since Mini Apps v6.9
 */
export const getCurrentTimeFp = create(pipe(
  sharedFeatureOptions(),
  withInvokeCustomMethod,
  withVersion,
));

/**
 * @see getCurrentTimeFp
 */
export const getCurrentTime = throwifyWithChecksFp(getCurrentTimeFp);
