import type { BiometryType } from '@/bridge/events/types.js';
import type { ExecuteWithTimeout, Maybe } from '@/types/index.js';

export interface State {
  accessGranted: boolean;
  accessRequested: boolean;
  available: boolean;
  deviceId: string;
  tokenSaved: boolean;
  token?: string;
  biometryType?: BiometryType;
}

export interface AuthenticateOptions extends ExecuteWithTimeout {
  /**
   * Reason to request biometry data. Should be at least 1 symbol length, but not more than
   * 128 symbols.
   */
  reason?: Maybe<string>;
}

export interface UpdateTokenOptions extends ExecuteWithTimeout {
  /**
   * Optional string field, containing the reason why the bot is asking to authenticate using biometrics (1-128 chars, used in the prompt).
   */
  reason?: string;
  /**
   * Token to save in the local device secure storage. Passing `null`, `undefined` or empty string
   * removes it from the storage.
   */
  token?: Maybe<string>;
}

export interface RequestAccessOptions extends ExecuteWithTimeout {
  /**
   * The text to be displayed to a user in the popup describing why the bot needs access to
   * biometrics, 0-128 characters.
   */
  reason?: Maybe<string>;
}
