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

### Updated `launchParams` typing

In v2, the `launchParams` option passed to `mockTelegramEnv` supports:

- Query string format (`string` or `URLSearchParams`)
- Object returned by `retrieveLaunchParams()`

However, note one key requirement: if using an object form, the `tgWebAppData` value must be provided as a query string,
since `retrieveRawInitData()` needs access to that exact format to work correctly.