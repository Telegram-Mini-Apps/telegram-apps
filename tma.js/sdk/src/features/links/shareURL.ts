import type * as E from 'fp-ts/Either';
import type { PostEventError } from '@tma.js/bridge';

import { withChecksFp } from '@/with-checks/withChecksFp.js';
import {
  sharedFeatureOptions,
  type SharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { openTelegramLinkFp } from '@/features/links/openTelegramLink.js';
import { throwifyWithChecksFp } from '@/with-checks/throwifyWithChecksFp.js';

interface CreateOptions extends SharedFeatureOptions {
  openTelegramLink: (url: string) => E.Either<PostEventError, void>;
}

export type ShareURLError = PostEventError;

function create({ openTelegramLink, ...rest }: CreateOptions) {
  return withChecksFp((url: string, text?: string): E.Either<ShareURLError, void> => {
    return openTelegramLink(
      'https://t.me/share/url?' + new URLSearchParams({ url, text: text || '' })
        .toString()
        // By default, URL search params encode spaces with "+".
        // We are replacing them with "%20", because plus symbols are working incorrectly
        // in Telegram.
        .replace(/\+/g, '%20'),
    );
  }, { ...rest, returns: 'either' });
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
export const shareURLFp = create({
  ...sharedFeatureOptions(),
  openTelegramLink: openTelegramLinkFp,
});

/**
 * @see shareURLFp
 */
export const shareURL = throwifyWithChecksFp(shareURLFp);
