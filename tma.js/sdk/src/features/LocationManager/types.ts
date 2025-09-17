import { Maybe } from '@tma.js/toolkit';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedComponentOptions,
  WithPostEvent,
  WithRequest,
  WithStorage,
  WithVersion,
} from '@/features/types.js';

export interface LocationManagerRequestLocationResponse {
  /**
   * Latitude in degrees.
   */
  latitude: number;
  /**
   * Longitude in degrees.
   */
  longitude: number;
  /**
   * Altitude above sea level in meters.
   */
  altitude?: Maybe<number>;
  /**
   * The direction the device is moving in degrees.
   */
  course?: Maybe<number>;
  /**
   * The speed of the device in m/s.
   */
  speed?: Maybe<number>;
  /**
   * Accuracy of the latitude and longitude values in meters.
   */
  horizontal_accuracy?: Maybe<number>;
  /**
   * Accuracy of the altitude value in meters.
   */
  vertical_accuracy?: Maybe<number>;
  /**
   * Accuracy of the course value in degrees.
   */
  course_accuracy?: Maybe<number>;
  /**
   * Accuracy of the speed value in m/s.
   */
  speed_accuracy?: Maybe<number>;
}

export interface LocationManagerState {
  /**
   * If true, indicates that location data tracking is available on the current device.
   */
  available: boolean;
  /**
   * Indicates whether the app has previously requested permission to track location data.
   */
  accessRequested: boolean;
  /**
   * Indicates whether the user has granted the app permission to track location data.
   *
   * If false and `accessRequested` is true may indicate that:
   *
   * - The user has simply canceled the permission popup.
   * - The user has denied the app permission to track location data.
   */
  accessGranted: boolean;
}

export type LocationManagerStorage = ComponentStorage<LocationManagerState>;

export interface LocationManagerOptions extends WithVersion,
  WithStorage<LocationManagerStorage>,
  WithRequest,
  WithPostEvent,
  SharedComponentOptions {
}
