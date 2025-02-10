# Usage Tips

## Avoid Using With Telegram SDK

Telegram provides a file `telegram-web-app.js`. When using `@telegram-apps/sdk`, you must avoid
using it alongside the SDK provided by Telegram. This is because both packages use the same
communication channel for transmitting events and calling methods.

> [!DANGER] What if I use both packages?
> In this case, some of these packages will not receive events sent from the native Telegram
> application, which will surely lead to bugs.

## Installing the SDK

Before installing the package, it is important to understand what specifically must be installed.
This depends on the technologies you are planning to use.

If your core library is one of the following, you should install a package specific to your main
library instead of `@telegram-apps/sdk`:

- React: [@telegram-apps/sdk-react](../../telegram-apps-sdk-react/3-x.md)
- Vue: [@telegram-apps/sdk-vue](../../telegram-apps-sdk-vue/2-x.md)
- Svelte: [@telegram-apps/sdk-svelte](../../telegram-apps-sdk-svelte/2-x.md)

For example, if your main library is React, you should install `@telegram-apps/sdk-react` instead
of `@telegram-apps/sdk`.

Here is the command to install the package:

::: code-group

```bash [pnpm]
pnpm i @telegram-apps/sdk-react
```

```bash [npm]
npm i @telegram-apps/sdk-react
```

```bash [yarn]
yarn add @telegram-apps/sdk-react
```

:::

If your main library is not on the list specified above or if you prefer a pure TypeScript solution,
install the `@telegram-apps/sdk` package:

::: code-group

```bash [pnpm]
pnpm i @telegram-apps/sdk
```

```bash [npm]
npm i @telegram-apps/sdk
```

```bash [yarn]
yarn add @telegram-apps/sdk
```

:::

> [!DANGER] Avoid installing both packages
> Installing both `@telegram-apps/sdk` and `@telegram-apps/sdk-react` (for example) may lead to bugs
> due to SDK package duplication, resulting in incorrect application behavior.

> [!TIP] Start with @telegram-apps/create-mini-app
> To avoid potential issues with bootstrapping your project, consider using the
> [@telegram-apps/create-mini-app](../../telegram-apps-create-mini-app.md) package. This will
> quickly generate a properly configured application for you.

## Initialize the SDK

The SDK provides a list of components that might seem ready to use once imported, but this is only
partially true.

It’s important to understand that the SDK does not have any side effects. To avoid various issues,
it doesn’t perform operations automatically upon import. Instead, you need to initialize it
manually.

By default, the SDK is uninitialized and not ready for use. All components remain unmounted. To
initialize the SDK and unlock not only the components’ `mount` method but also other
non-component-related methods, you **must** use the `init` function.

```ts
import { init } from '@telegram-apps/sdk';

init();
```

After calling this, it is now safe to mount any components you wish to use in your application.

## Mount Used Components

In the previous section, we initialized the SDK, allowing us to use components.

Before using specific components in your application, you must mount them. Not mounting components
will cause their methods to throw errors. For example, the following code will cause issues:

```ts
import { init, backButton } from '@telegram-apps/sdk';

// Initialize the SDK.
init();

// Attempt to show the Back Button.
backButton.show();
// Error: The backButton component was not mounted.
```

To avoid this issue, mount the component before using its methods:

```ts
import { init, backButton } from '@telegram-apps/sdk';

// Initialize the SDK.
init();

// Mount the Back Button.
backButton.mount();

// Show the Back Button.
backButton.show();
```

> [!TIP]
> The mount-checking mechanism ensures that you are working with a properly initialized component.

## Always Check Availability

Not all Telegram Mini Apps methods were implemented in a single release. Some may have been
implemented years ago, while others were introduced only recently.

Because there are many users with different versions of the native Telegram application, you must
check if a method is available on their device before using it:

```ts
import { backButton } from '@telegram-apps/sdk';

// ... the SDK is already initialized, and the Back Button is mounted.
if (backButton.show.isAvailable()) {
  backButton.show();
}
```

The `isAvailable()` method verifies if the function is currently available and can be safely called.
It performs the following checks:

- The current environment is Telegram Mini Apps
- The SDK is initialized
- The method is supported by the current Telegram Mini Apps version
- The parent component is mounted

Not using this signal and simply calling the method may lead to errors related to one of the above
checks.

If you don’t want to perform this check every time and the result of the method execution is not
crucial, use the `ifAvailable(...args)` method. This method accepts the same parameters as the
original function:

```ts
import { backButton } from '@telegram-apps/sdk';

// ... the SDK is already initialized, and the Back Button is mounted.
backButton.show.ifAvailable();
```