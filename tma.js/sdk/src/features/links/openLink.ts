import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import type { OpenLinkBrowser, PostEventError } from '@tma.js/bridge';

import {
  type SharedFeatureOptions,
  sharedFeatureOptions,
} from '@/fn-options/sharedFeatureOptions.js';
import { type WithPostEvent, withPostEvent } from '@/fn-options/withPostEvent.js';
import { withChecksFp } from '@/wrappers/withChecksFp.js';
import { InvalidArgumentsError } from '@/errors.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';

interface CreateOpenLinkOptions extends SharedFeatureOptions, WithPostEvent {
}

export interface OpenLinkOptions {
  /**
   * Attempts to use the instant view mode.
   */
  tryInstantView?: boolean;
  /**
   * A preferred browser to open the link in.
   */
  tryBrowser?: OpenLinkBrowser;
}

export type OpenLinkError = PostEventError | InvalidArgumentsError;

/**
 * @internal
 */
function createOpenLink({ postEvent, ...rest }: CreateOpenLinkOptions) {
  return withChecksFp((
    url: string | URL,
    options: OpenLinkOptions = {},
  ): E.Either<OpenLinkError, void> => {
    if (typeof url === 'string') {
      try {
        url = new URL(url);
      } catch (e) {
        return E.left(new InvalidArgumentsError(`"${url.toString()}" is invalid URL`, e));
      }
    }
    return postEvent('web_app_open_link', {
      url: url.toString(),
      try_browser: options.tryBrowser,
      try_instant_view: options.tryInstantView,
    });
  }, { ...rest, returns: 'either' });
}

/**
 * Opens a link.
 *
 * The Mini App will not be closed.
 *
 * Note that this method can be called only in response to the user
 * interaction with the Mini App interface (e.g. click inside the Mini App or on the main button).
 * @param url - URL to be opened.
 * @param options - additional options.
 * @example
 * openLink('https://google.com', {
 *   tryInstantView: true,
 *   tryBrowser: 'chrome',
 * });
 */
export const openLinkFp = createOpenLink(pipe(
  sharedFeatureOptions(),
  withPostEvent,
));

export const openLink = throwifyWithChecksFp(openLinkFp);
