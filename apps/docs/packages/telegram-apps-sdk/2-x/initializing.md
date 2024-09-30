# Initializing

As mentioned in
the `@telegram-apps/bridge` [documentation](../../telegram-apps-bridge/events.md#define-event-handlers),
event handlers must be defined manually to start listening to Telegram Mini Apps events.

Additionally, in our code, we want to ensure that if a method is called, it will either work or we
will be notified that it won't. To achieve this, it is necessary to know the currently used Telegram
Mini Apps version.

To address these requirements, the package provides the `init` function, which accepts an object
with the following structure:

```ts
interface Options {
  /**
   * True if the SDK should accept styles sent from the Telegram
   * application.
   * @default true
   */
  acceptCustomStyles?: boolean;
  /**
   * The maximum supported Mini Apps version.
   * @default Extracted using the `retrieveLaunchParams`
   * function.
   * @see retrieveLaunchParams
   */
  version?: Version;
  /**
   * Custom postEvent function.
   *
   * Passing the "strict" value creates a function that always
   * checks if the specified call is supported by the current Mini
   * Apps version. If the method is unsupported, an error
   * will be thrown.
   *
   * Passing the "non-strict" value creates a postEvent function
   * that doesn't throw errors but warns about missing method
   * support.
   *
   * @default 'strict'
   * @see createPostEvent
   */
  postEvent?: PostEventFn | 'strict' | 'non-strict';
}
```

In most scenarios, a developer does not need to use these options.

By calling this function, the package's global dependencies will be configured, and the Telegram
Mini Apps event handlers will be created.

```ts
import { init } from '@telegram-apps/sdk';

init();
```