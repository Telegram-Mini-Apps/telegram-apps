import type * as E from 'fp-ts/Either';

import { withChecksFp } from '@/with-checks/withChecksFp.js';
import { sharedFeatureOptions, type SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import {
  type OpenTelegramLinkError,
  openTelegramLinkFp,
} from '@/features/links/openTelegramLink.js';
import { throwifyWithChecksFp } from '@/with-checks/throwifyWithChecksFp.js';

function create(options: SharedFeatureOptions) {
  return withChecksFp((url: string, text?: string): E.Either<OpenTelegramLinkError, void> => {
    // FIXME: It must use a raw implementation.
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
export const shareURLFp = create(sharedFeatureOptions());

/**
 * @see shareURLFp
 */
export const shareURL = throwifyWithChecksFp(shareURLFp);
