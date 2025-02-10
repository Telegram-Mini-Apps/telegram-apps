# Initializing

As long as the SDK uses some internal global dependencies, before using it, the package must be
configured. Not doing it, most package functions will not work at all and will throw a
corresponding error.

To initialize the SDK, the package provides the `init` function, which accepts an object
with the following structure:

```ts
interface Options {
  /**
   * True if SDK should accept styles sent from the Telegram application.
   * @default true
   */
  acceptCustomStyles?: boolean;
  /**
   * Launch parameters used across the package.
   * @default Being extracted using the `retrieveLaunchParams` function.
   * @see retrieveLaunchParams
   */
  launchParams?:
    & Omit<LaunchParamsLike, 'tgWebAppThemeParams'>
    & Partial<Pick<LaunchParamsLike, 'tgWebAppThemeParams'>>;
  /**
   * Custom postEvent function.
   * @default The `createPostEvent` function will be used with the version, specified in
   * the `launchParams` option.
   * @see createPostEvent
   */
  postEvent?: PostEventFn;
}
```

In most scenarios, a developer does not need to use these options.

By calling this function, the package's global dependencies will be configured, and the package
becomes ready to use.

```ts
import { init } from '@telegram-apps/sdk';

init();
```