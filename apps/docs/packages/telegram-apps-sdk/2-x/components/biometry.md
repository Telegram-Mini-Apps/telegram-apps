# Biometry

The 💠[component](../scopes.md) responsible for biometry functionality for Telegram Mini Apps.

## Checking Support

To check if biometry is supported by the current Telegram Mini Apps version, use the `isSupported`
method:

::: code-group

```ts [Variable]
import { biometry } from '@telegram-apps/sdk';

biometry.isSupported(); // boolean
```

```ts [Functions]
import { isBiometrySupported } from '@telegram-apps/sdk';

isBiometrySupported(); // boolean
```

:::

## Mounting

Before using the component, it must be mounted.

This process is asynchronous, as biometry data needs to be requested from the Telegram application.
The `isMounting` signal will be set to `true` during the process and updated to `false` when
complete.

If mounting is successful, the `isMounted` signal will be set to `true`. If errors occur,
the `mountError` signal will reflect the error.

::: code-group

```ts [Variable]
if (biometry.mount.isAvailable()) {
  try {
    const promise = biometry.mount();
    biometry.isMounting(); // true
    await promise;
    biometry.isMounting(); // false
    biometry.isMounted(); // true
  } catch (err) {
    biometry.mountError(); // equals "err"
    biometry.isMounting(); // false
    biometry.isMounted(); // false
  }
}
```

```ts [Functions]
import {
  mountBiometry,
  isBiometryMounting,
  isBiometryMounted,
  biometryMountError,
} from '@telegram-apps/sdk';

if (mountBiometry.isAvailable()) {
  try {
    const promise = mountBiometry();
    isBiometryMounting(); // true
    await promise;
    isBiometryMounting(); // false
    isBiometryMounted(); // true
  } catch (err) {
    biometryMountError(); // equals "err"
    isBiometryMounting(); // false
    isBiometryMounted(); // false
  }
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
biometry.unmount();
biometry.isMounted(); // false
```

```ts [Functions]
import { unmountBiometry, isBiometryMounted } from '@telegram-apps/sdk';

unmountBiometry();
isBiometryMounted(); // false
```

:::

## Requesting Biometry Access

To request biometry access, use the `requestAccess` method. It returns a promise with boolean
value indicating whether access was granted by the user.

::: code-group

```ts [Variable]
if (biometry.requestAccess.isAvailable()) {
  const granted = await biometry.requestAccess(); // boolean
}
```

```ts [Functions]
import { requestBiometryAccess } from '@telegram-apps/sdk';

if (requestBiometryAccess.isAvailable()) {
  const granted = await requestBiometryAccess(); // boolean
}
```

:::

## Authenticating

To authenticate a user and retrieve a previously saved token, use the `authenticate` method.

It optionally accepts an object with the following properties:

- `reason?: string`: a reason for authentication to display to the user.

The method returns an object with `status` (`'failed'` or `'authorized'`) and, if successful,
a `token: string`.

::: code-group

```ts [Variable]
if (biometry.authenticate.isAvailable()) {
  const { status, token } = await biometry.authenticate({
    reason: 'Please!',
  });

  if (status === 'authorized') {
    console.log(`Authorized. Token: ${token}`);
  } else {
    console.log('Not authorized');
  }
}
```

```ts [Functions]
import { authenticateBiometry } from '@telegram-apps/sdk';

if (authenticateBiometry.isAvailable()) {
  const { status, token } = await authenticateBiometry({
    reason: 'Please!',
  });

  if (status === 'authorized') {
    console.log(`Authorized. Token: ${token}`);
  } else {
    console.log('Not authorized');
  }
}
```

:::

## Updating Token

To update the token stored in local secure storage, use the `updateToken` method.

The method accepts an optional object with the `reason` and `token` properties. If no token is
provided, the existing token will be deleted.

It returns a promise with boolean indicating if any changes were made.

::: code-group

```ts [Variable]
if (biometry.updateToken.isAvailable()) {
  const updated = await biometry.updateToken({
    reason: 'Want to delete',
  });

  await biometry.updateToken({
    reason: 'Will set a new one',
    token: 'new token',
  });
}
```

```ts [Functions]
import { updateBiometryToken } from '@telegram-apps/sdk';

if (updateBiometryToken.isAvailable()) {
  const updated = await updateBiometryToken({
    reason: 'Want to delete',
  });

  await updateBiometryToken({
    reason: 'Will set a new one',
    token: 'new token',
  });
}
```

:::

## Opening Settings

To open the biometry-related settings modal, use the `openSettings` method. This method can only be
triggered in response to user interaction.

::: code-group

```ts [Variable]
if (biometry.openSettings.isAvailable()) {
  biometry.openSettings();
}
```

```ts [Functions]
import { openBiometrySettings } from '@telegram-apps/sdk';

if (openBiometrySettings.isAvailable()) {
  openBiometrySettings();
}
```

:::
