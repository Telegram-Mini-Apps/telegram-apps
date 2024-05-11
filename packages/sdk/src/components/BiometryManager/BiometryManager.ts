import { request } from '@/bridge/utils/request.js';
import { WithSupportsAndTrackableState } from '@/classes/WithSupportsAndTrackableState.js';
import { formatEvent } from '@/components/BiometryManager/formatEvent.js';
import type { BiometryType } from '@/bridge/events/types.js';
import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type {
  BiometryManagerAuthenticateOptions,
  BiometryManagerProps,
  BiometryManagerRequestAccessOptions,
  BiometryManagerState,
  BiometryManagerUpdateTokenOptions,
} from '@/components/BiometryManager/types.js';

export class BiometryManager extends WithSupportsAndTrackableState<BiometryManagerState,
  | 'auth'
  | 'openSettings'
  | 'requestAccess'
  | 'updateToken'
> {
  private readonly postEvent: PostEvent;

  private authPromise?: Promise<string | undefined>;

  private accessPromise?: Promise<boolean>;

  constructor({ postEvent, version, ...rest }: BiometryManagerProps) {
    super(rest, version, {
      auth: 'web_app_biometry_request_auth',
      openSettings: 'web_app_biometry_open_settings',
      requestAccess: 'web_app_biometry_request_access',
      updateToken: 'web_app_biometry_update_token',
    });
    this.postEvent = postEvent;
  }

  /**
   * Shows whether biometry is available.
   */
  get available(): boolean {
    return this.get('available');
  }

  /**
   * Shows whether permission to use biometrics has been granted.
   */
  get accessGranted(): boolean {
    return this.get('accessGranted');
  }

  /**
   * Shows whether if permission to use biometrics has been requested.
   */
  get accessRequested(): boolean {
    return this.get('accessRequested');
  }

  /**
   * Authenticates the user using biometrics.
   * @param options - method options.
   * @since 7.2
   * @returns Token from the local secure storage, if authentication was successful.
   */
  async authenticate({
    reason,
    ...rest
  }: BiometryManagerAuthenticateOptions): Promise<string | undefined> {
    if (!this.authPromise) {
      this.authPromise = request({
        ...rest,
        method: 'web_app_biometry_request_auth',
        event: 'biometry_auth_requested',
        postEvent: this.postEvent,
        params: {
          // TODO: Check if reason is empty works fine.
          reason: (reason || '').trim(),
        },
      })
        .then(({ token }) => token)
        .finally(() => this.authPromise = undefined);
    }
    return this.authPromise;
  }

  /**
   * A unique device identifier that can be used to match the token to the device.
   */
  get deviceId(): string {
    return this.get('deviceId');
  }

  /**
   * Opens the biometric access settings for bots. Useful when you need to request biometrics
   * access to users who haven't granted it yet.
   *
   * _Note that this method can be called only in response to user interaction with the Mini App
   * interface (e.g. a click inside the Mini App or on the main button)_.
   * @since 7.2
   */
  openSettings(): void {
    this.postEvent('web_app_biometry_open_settings');
  }

  /**
   * Requests permission to use biometrics.
   * @since 7.2
   * @returns Promise with true, if access was granted.
   */
  requestAccess({ reason, ...rest }: BiometryManagerRequestAccessOptions = {}): Promise<boolean> {
    if (!this.accessPromise) {
      this.accessPromise = request({
        ...rest,
        postEvent: this.postEvent,
        method: 'web_app_biometry_request_access',
        event: 'biometry_info_received',
        params: { reason: reason || '' },
      })
        .then((response) => {
          // Actualize local state.
          const formatted = formatEvent(response);
          this.set(formatted);

          return formatted.accessGranted;
        })
        .finally(() => this.accessPromise = undefined);
    }
    return this.accessPromise;
  }

  /**
   * The type of biometrics currently available on the device.
   */
  get biometryType(): BiometryType | undefined {
    return this.get('biometryType');
  }

  /**
   * Shows whether token was saved previously in the local secure storage.
   */
  get tokenSaved(): boolean {
    return this.get('tokenSaved');
  }

  /**
   * Updates the biometric token in a secure storage on the device.
   * @returns Promise with `true`, if token was updated.
   */
  async updateToken({ token, ...rest }: BiometryManagerUpdateTokenOptions = {}): Promise<boolean> {
    return ['removed', 'updated'].includes(
      (
        await request({
          ...rest,
          postEvent: this.postEvent,
          method: 'web_app_biometry_update_token',
          event: 'biometry_token_updated',
          params: { token: token || '' },
        })
      ).status,
    );
  }
}
