import type { BiometryType } from '@/bridge/events/types.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { ExecuteWithTimeout, Maybe } from '@/types/index.js';
import type { Version } from '@/version/types.js';

export interface BiometryManagerState {
  accessGranted: boolean;
  accessRequested: boolean;
  available: boolean;
  deviceId: string;
  tokenSaved: boolean;
  token?: string;
  biometryType?: BiometryType;
}

export interface BiometryManagerProps extends BiometryManagerState {
  postEvent: PostEvent;
  version: Version;
}

export interface BiometryManagerAuthenticateOptions extends ExecuteWithTimeout {
  /**
   * The text to be displayed to a user in the popup describing why you are
   * asking them to authenticate and what action you will be taking based on that
   * authentication, 0-128 characters.
   */
  reason?: Maybe<string>;
}

export interface BiometryManagerUpdateTokenOptions extends ExecuteWithTimeout {
  /**
   * Token to save in the local device secure storage. Passing `null`, `undefined` or empty string
   * removes it from the storage.
   */
  token?: Maybe<string>;
}

export interface BiometryManagerRequestAccessOptions extends ExecuteWithTimeout {
  /**
   * The text to be displayed to a user in the popup describing why the bot needs access to
   * biometrics, 0-128 characters.
   */
  reason?: Maybe<string>;
}
