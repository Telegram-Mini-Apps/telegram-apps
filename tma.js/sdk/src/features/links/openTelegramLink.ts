import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { supports, type PostEventError } from '@tma.js/bridge';

import {
  type SharedFeatureOptions,
  sharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { withPostEvent, type WithPostEvent } from '@/fn-options/withPostEvent.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { InvalidArgumentsError } from '@/errors.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import { withVersion, type WithVersion } from '@/fn-options/withVersion.js';
import { access } from '@/helpers/access.js';

interface CreateOpenTelegramLinkOptions extends SharedFeatureOptions, WithPostEvent, WithVersion {
}

export type OpenTelegramLinkError = PostEventError | InvalidArgumentsError;

/**
 * @internal
 */
function createOpenTelegramLink({ postEvent, version, ...rest }: CreateOpenTelegramLinkOptions) {
  return withChecksFp((
    url: string | URL,
  ): E.Either<OpenTelegramLinkError, void> => {
    const urlString = url.toString();
    if (!urlString.match(/^https:\/\/t.me\/.+/)) {
      return E.left(new InvalidArgumentsError(`"${urlString}" is invalid URL`));
    }

    if (supports('web_app_open_tg_link', access(version))) {
      url = new URL(url);
      return postEvent('web_app_open_tg_link', { path_full: url.pathname + url.search });
    }

    window.location.href = urlString;
    return E.right(undefined);
  }, { ...rest, returns: 'either' });
}

/**
 * Opens a Telegram link inside the Telegram app. The function expects passing a link in a full
 * format using the hostname "t.me".
 *
 * The Mini App will be closed.
 * @param url - URL to be opened.
 * @example
 * openTelegramLink('https://t.me/heyqbnk');
 */
export const openTelegramLinkFp = createOpenTelegramLink(pipe(
  sharedFeatureOptions(),
  withPostEvent,
  withVersion,
));

/**
 * @see openTelegramLinkFp
 */
export const openTelegramLink = throwifyWithChecksFp(openTelegramLinkFp);
