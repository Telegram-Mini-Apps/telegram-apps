# Globals

By globals, we mean global values used across methods in the package.

::: tip

The package re-exports all globals presented in
the [@telegram-apps/bridge](../../telegram-apps-bridge/globals.md) package.

:::

## `$postEvent`

The signal responsible for providing
the [postEvent](../../telegram-apps-bridge/methods.md#postevent) function to all SDK methods.

```ts
import { $postEvent, LaunchParams, createPostEvent } from '@telegram-apps/sdk';

$postEvent.set(
  // Replace throwing errors with warnings.
  createPostEvent(LaunchParams.retrieve().version, 'non-strict')
);
```

## `$version`

This signal provides information on which Telegram Mini Apps version is currently supported by the
application.

## Configuring

As the package has no side effects (it doesn't perform any operations on import), you should
configure the global values yourself.

To simplify this process, a developer can use the `configure` method. It automatically extracts
required parameters using the current environment and configures global values for future use.

```ts
import { configure, $version } from '@telegram-apps/bridge';

// $version will be 0.0 initially.
console.log($version());

configure();

// $version will update to a more accurate value, like 7.10.
console.log($version());
```

Optionally, a developer can pass an object with the properties `version?: string`
and `postEvent?: PostEventFn | 'strict' | 'non-strict'`, which will be used to configure the global
signals mentioned previously.

If the `postEvent` property is not a function, it will be passed directly to
the [createPostEvent](../../telegram-apps-bridge/methods.md#creating-safer-postevent) function.

```ts
configure({
  postEvent: 'non-strict',
});
```