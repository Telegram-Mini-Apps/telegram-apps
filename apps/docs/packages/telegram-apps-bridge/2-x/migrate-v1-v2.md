# Migrating from v1 to v2

This guide provides a summary of the migration process from version 1 to version 2 of the `@telegram-apps/bridge`
package.

## Changes to `retrieveLaunchParams`

### Native key naming

In version 3, the returned launch parameters now preserve the original key names passed by the Telegram client. That
means all keys use the `tgWebApp` prefix and are no longer modified into camelCase by default.

Additionally, the result now includes all parameters—even those not explicitly typed—to better support future updates.

You can optionally pass `true` as an argument to `retrieveLaunchParams()` if you want the result to be deeply
camelCased, similar to v1 behavior.

Be sure to update any usages of v1-style keys like `themeParams` or `initData` to their new equivalents, such as
`tgWebAppThemeParams` and `tgWebAppData`. The `initData` property has been renamed to its original form: `tgWebAppData`.

:::code-group

```ts [v1]
import { retrieveLaunchParams } from '@telegram-apps/bridge';

retrieveLaunchParams();
// Returns:
// {
//   botInline: false,
//   initData: {
//     user: { ... },
//     authDate: Date(...),
//     queryId: ...,
//     hash: ...
//   },
//   ...
// };
```

```ts [v2]
import { retrieveLaunchParams } from '@telegram-apps/bridge';

retrieveLaunchParams();
// Returns:
// {
//   tgWebAppBotInline: false,
//   tgWebAppData: {
//     user: { ... },
//     auth_date: Date(...),
//     query_id: ...,
//     hash: ...
//   },
//   ...
// };
```

```ts [v2 with true]
import { retrieveLaunchParams } from '@telegram-apps/bridge';

retrieveLaunchParams(true);
// Returns:
// {
//   tgWebAppBotInline: false,
//   tgWebAppData: {
//     user: { ... },
//     authDate: Date(...),
//     queryId: ...,
//     hash: ...
//   },
//   ...
// };
```

:::

### `initDataRaw` moved

Since the raw init data isn't technically a separate launch parameter, it's now retrieved via a new function:
`retrieveRawInitData()`.

:::code-group

```ts [v1]
import { retrieveLaunchParams } from '@telegram-apps/bridge';

retrieveLaunchParams().initDataRaw;
// → '{"user":...,"auth_date":...,"query_id":...,...}'
```

```ts [v2]
import { retrieveRawInitData } from '@telegram-apps/bridge';

retrieveRawInitData();
// → '{"user":...,"auth_date":...,"query_id":...,...}'
```

:::

## Changes to `mockTelegramEnv`

### Changes to the argument

The function now accepts an object with optional properties `launchParams`, `onEvent` and `resetPostMessage`.

In v2, the `launchParams` option passed to `mockTelegramEnv` supports:

- Query string format (`string` or `URLSearchParams`)
- Object with the same shape returned by `retrieveLaunchParams()`

However, note one key requirement: if using an object `launchParams`, the `tgWebAppData` value must be provided as a
query string, since `retrieveRawInitData()` needs access to that exact format to work correctly.

## Changes to signals

### `$debug` variable removed

The `$debug` variable was removed from the package exports. To set debug mode, use the `setDebug` function.

:::code-group

```ts [v1]
import { $debug } from '@telegram-apps/bridge';

$debug.set(true);
```

```ts [v2]
import { setDebug } from '@telegram-apps/bridge';

setDebug(true);
```

:::

### `$targetOrigin` variable renamed

The `$targetOrigin` variable was renamed to `targetOrigin`.

:::code-group

```ts [v1]
import { $targetOrigin } from '@telegram-apps/bridge';

$targetOrigin.set('https://my-domain.com');
```

```ts [v2]
import { targetOrigin } from '@telegram-apps/bridge';

targetOrigin.set('https://my-domain.com');
```

:::

## Changes to `isTMA`

The default mode for this function is now `simple`. To use the synchronous way, use the `complete` value.

:::code-group

```ts [v1]
import { isTMA } from '@telegram-apps/bridge';

if (isTMA('simple')) {
  // ...
}

if (await isTMA()) {
  // ...
}
```

```ts [v2]
import { isTMA } from '@telegram-apps/bridge';

if (isTMA()) {
  // ...
}

if (await isTMA('complete')) {
  // ...
}
```

:::

## Changes to events listening

The functions `susbcribe`, `unsubscribe` were removed in favor of the `on` function. To start listening to all events,
use the `on(*, ...)` expression. To remove bound global listener, use the `off('*', ...)` expression.

:::code-group

```ts [v1]
import { susbcribe, unsubscribe } from '@telegram-apps/bridge';

function handler(event) {

}

susbcribe(handler);
unsubscribe(handler);
```

```ts [v2]
import { on, off } from '@telegram-apps/bridge';

function handler(event) {

}

on('*', handler);
off('*', handler);
```

:::

The function `defineEventHandlers` was also removed. You now have no need to define any special event handlers yourself.