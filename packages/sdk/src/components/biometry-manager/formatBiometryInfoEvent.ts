import type { BiometryType, MiniAppsEventPayload } from '@/bridge/events/types.js';

export interface FormatBiometryInfoResult {
  /**
   * Shows whether biometry is available.
   */
  available: boolean;
  /**
   * Shows whether permission to use biometrics has been requested.
   */
  accessRequested: boolean;
  /**
   * Shows whether permission to use biometrics has been granted.
   */
  accessGranted: boolean;
  /**
   * A unique device identifier that can be used to match the token to the device.
   */
  deviceId: string;
  /**
   * Show whether local storage contains previously saved token.
   */
  tokenSaved: boolean;
  /**
   * The type of biometrics currently available on the device.
   */
  type: BiometryType;
}

/**
 * Converts `biometry_info_received` to some common shape.
 * @param event - event payload.
 * @see biometry_info_received
 */
export function formatBiometryInfoEvent(
  event: MiniAppsEventPayload<'biometry_info_received'>,
): FormatBiometryInfoResult {
  const data = event.available ? event : {
    available: false,
    device_id: '',
    token_saved: false,
    access_requested: false,
    access_granted: false,
    type: '',
  };

  return {
    available: true,
    type: data.type,
    deviceId: data.device_id,
    tokenSaved: data.token_saved,
    accessRequested: data.access_requested,
    accessGranted: data.access_granted,
  };
}
