# Usage Tips

## Avoid Using With Telegram SDK

Telegram is a file `telegram-web-app.js` provided by Telegram. Using `@telegram-apps/sdk` you
must avoid using it with the SDK provided by Telegram. The reason is both of these packages
use the same communication channel used for transmitting events and calling methods. 

> [!DANGER] What if I use both of these packages?
> In this case some of these packages will not receive events sent from the native Telegram
> application. This will surely lead to bugs.

## Installing the SDK

Before installing the package, it is required to understand what exactly must be installed.
It depends on the technologies you are going to use.

In case the core library is one of the following, you should not install the `@telegram-apps/sdk`,
but a package specific for you main library:

- React: [@telegram-apps/sdk-react](../../telegram-apps-sdk-react/2-x.md)
- Vue: [@telegram-apps/sdk-vue](../../telegram-apps-sdk-vue.md)
- Svelte: [@telegram-apps/sdk-svelte](../../telegram-apps-sdk-svelte.md)

So, in case you main library is React, you should install `@telegram-apps/sdk-react` instead
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

If your main library is not in the list specified previously or you prefer pure TypeScript
solutions, install the `@telegram-apps/sdk` package:

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
> Installing both `@telegram-apps/sdk` and `@telegram-apps/sdk-react` (for example) may lead
> to bugs related to the SDK package duplication. This will surely lead to incorrect application
> behavior.

> [!TIP] Start with @telegram-apps/create-mini-app
> To avoid possible problems with bootstrapping your project, consider using the
> [@telegram-apps/create-mini-app](../../telegram-apps-create-mini-app.md) package. It will
> rapidly generate a properly configured application for you.

## Initialize the SDK

The SDK provides a list of components which may seem to easily used just being imported. Well,
it's only half true.

It is important to understand that the SDK doesn't have any side-effects. It means to avoid
problems of a different kind when being imported, it doesn't perform any operations. Instead, you
should do it on your own.

By default, the SDK is not initialized and is not ready to be used. All components are unmounted as
well. To initialize the SDK and unlock not only components' `mount` method, but some other not
related to components, you **must** use the `init` function.

```ts
import { init } from '@telegram-apps/sdk';

init();
```

After being called, it is now safe to mount any components you want to use in your application.

## Mount Used Components

In the previous section we have initialized the SDK and now we are free to use components.

Before using specific components in your application, you must mount them. Not mounting components
will lead to their methods to throw errors. So, this code will surely end badly:

```ts
import { init, backButton } from '@telegram-apps/sdk';

// Initialize the SDK.
init();

// Try to show the Back Button.
backButton.show();
// TypedError: ERR_NOT_MOUNTED: The backButton component 
// was not mounted.
```

To avoid such kind of problem, before using the component's methods, it is required to mount
the component itself:

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
> Mount checking mechanism is required to ensure that you are working with properly initialized
> component.

## Always Check Availability

Not all Telegram Mini Apps methods were implemented in a single release. Some of them may be 
implemented years ago, when some of were implemented only several months ago.

Due to the reason, there are a lot of different users with different versions of the native
Telegram application, before using some method, it is required to check if it is available:

```ts
import { backButton } from '@telegram-apps/sdk';

// ... the SDK is already initialized, the Back Button
// is already mounted.
if (backButton.show.isAvailable()) {
  backButton.show();
}
```

The `isAvailable()` signal is responsible for indicating if the method is currently available and
can be safely called. It performs the following checks:

- The current environment is Telegram Mini Apps
- The SDK is initialized
- The method is supported by the current Telegram Mini Apps version
- The parent component is mounted

Not using this signal and just calling the method may lead to throwing errors related to one of
the checks specified above.

In case, you don't want to always perform this check and the result of the method execution is
not really important, just use the `ifAvailable(...args)` method. It has the same list of
parameters as the original function does:

```ts
import { backButton } from '@telegram-apps/sdk';

// ... the SDK is already initialized, the Back Button
// is already mounted.
backButton.show.ifAvailable();
```