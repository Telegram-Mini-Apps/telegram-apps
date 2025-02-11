# Location Manager

The 💠[component](../scopes.md) responsible for location tracking functionality for Telegram Mini
Apps.

## Checking Support

To check if location tracking is supported by the current Telegram Mini Apps version, use the
`isSupported` signal:

::: code-group

```ts [Variable]
import { locationManager } from '@telegram-apps/sdk';

locationManager.isSupported(); // boolean
```

```ts [Functions]
import { isLocationManagerSupported } from '@telegram-apps/sdk';

isLocationManagerSupported(); // boolean
```

:::

## Mounting

Before using the component, it must be mounted.

This process is asynchronous, as location manager settings need to be requested from the Telegram
application. The `isMounting` signal will be set to `true` during the process and updated to `false`
when complete.

If mounting is successful, the `isMounted` signal will be set to `true`. If errors occur,
the `mountError` signal will reflect the error.

::: code-group

```ts [Variable]
if (locationManager.mount.isAvailable()) {
  try {
    const promise = locationManager.mount();
    locationManager.isMounting(); // true
    await promise;
    locationManager.isMounting(); // false
    locationManager.isMounted(); // true
  } catch (err) {
    locationManager.mountError(); // equals "err"
    locationManager.isMounting(); // false
    locationManager.isMounted(); // false
  }
}
```

```ts [Functions]
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
} from '@telegram-apps/sdk';

if (mountLocationManager.isAvailable()) {
  try {
    const promise = mountLocationManager();
    isLocationManagerMounting(); // true
    await promise;
    isLocationManagerMounting(); // false
    isLocationManagerMounted(); // true
  } catch (err) {
    locationManagerMountError(); // equals "err"
    isLocationManagerMounting(); // false
    isLocationManagerMounted(); // false
  }
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
locationManager.unmount();
locationManager.isMounted(); // false
```

```ts [Functions]
import { unmountLocationManager, isLocationManagerMounted } from '@telegram-apps/sdk';

unmountLocationManager();
isLocationManagerMounted(); // false
```

:::

## Requesting Location

To request the current location, use the `requestLocation` method. It returns a cancelable promise
with an object, describing the current device location.

The object contains the following numeric properties:

| Property            | Description                                                          |
|---------------------|----------------------------------------------------------------------|
| latitude            | Latitude in degrees.                                                 |
| longitude           | Longitude in degrees.                                                |
| altitude            | _Optional_. Altitude above sea level in meters.                      |
| course              | _Optional_. The direction the device is moving in degrees.           |
| speed               | _Optional_. The speed of the device in m/s.                          |
| horizontal_accuracy | _Optional_. Accuracy of the latitude and longitude values in meters. |
| vertical_accuracy   | _Optional_. Accuracy of the altitude value in meters.                |
| course_accuracy     | _Optional_. Accuracy of the course value in degrees.                 |
| speed_accuracy      | _Optional_. Accuracy of the speed value in m/s.                      |

::: code-group

```ts [Variable]
if (locationManager.requestLocation.isAvailable()) {
  const location = await locationManager.requestLocation();
}
```

```ts [Functions]
import { requestLocation } from '@telegram-apps/sdk';

if (requestLocation.isAvailable()) {
  const location = await requestLocation();
}
```

:::

## Opening Settings

To open the location manager-related settings modal, use the `openSettings` method. This method can
only be triggered in response to user interaction.

::: code-group

```ts [Variable]
if (locationManager.openSettings.isAvailable()) {
  locationManager.openSettings();
}
```

```ts [Functions]
import { openLocationManagerSettings } from '@telegram-apps/sdk';

if (openLocationManagerSettings.isAvailable()) {
  openLocationManagerSettings();
}
```

:::
