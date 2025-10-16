import type * as E from 'fp-ts/Either';

import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { sharedFeatureOptions, type SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import {
  type OpenTelegramLinkError,
  openTelegramLinkFp,
} from '@/features/links/openTelegramLink.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

type CreateShareURLOptions = SharedFeatureOptions;

/**
 * @internal
 */
function createShareURL(options: CreateShareURLOptions) {
  return withChecksFp((url: string, text?: string): E.Either<OpenTelegramLinkError, void> => {
    return openTelegramLinkFp(
      'https://t.me/share/url?' + new URLSearchParams({ url, text: text || '' })
        .toString()
        // By default, URL search params encode spaces with "+".
        // We are replacing them with "%20", because plus symbols are working incorrectly
        // in Telegram.
        .replace(/\+/g, '%20'),
    );
  }, { ...options, returns: 'either' });
}

/**
 * Shares the specified URL with the passed to the chats, selected by user.
 * After being called, it closes the mini application.
 *
 * This method uses Telegram's Share Links.
 * @param url - URL to share.
 * @param text - text to append after the URL.
 * @see https://core.telegram.org/api/links#share-links
 * @see https://core.telegram.org/widgets/share#custom-buttons
 */
export const shareURLFp = createShareURL(sharedFeatureOptions());

/**
 * @see shareURLFp
 */
export const shareURL = throwifyWithChecksFp(shareURLFp);
