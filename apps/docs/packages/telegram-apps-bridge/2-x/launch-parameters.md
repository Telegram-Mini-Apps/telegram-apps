# Launch Parameters

Launch parameters are essential to the mini application lifecycle. To learn more about what launch
parameters are and their importance, it is worth reading [this](../../../platform/launch-parameters)
article.

## Retrieving Launch Parameters

This package allows a developer to extract launch parameters from the current environment using
the `retrieveLaunchParams` function. It tries to retrieve them from all possible sources, and if it
fails, an error will be thrown.

```typescript
import { retrieveLaunchParams } from '@telegram-apps/bridge';

retrieveLaunchParams();
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

To retrieve launch params deeply converted to camel case, pass the `true` value as the first
argument:

```ts
retrieveLaunchParams(true);
// {
//   tgWebAppBotInline: false,
//   tgWebAppData: {
//     user: { ... },
//     authDate: Date(...),
//     queryId: ...
//     hash: ...
//   },
//   ...
// };
```

### Raw

To retrieve launch parameters in their initial format—as query parameters, use
the `retrieveRawLaunchParams` function:

```ts
import { retrieveRawLaunchParams } from '@telegram-apps/bridge';

retrieveRawLaunchParams();
// tgWebAppBotInline=0&tgWebAppData=%7B%22user%22%3A%7B%7D%2C%22auth_date%22%3A1787367222%2C%22query_id%22%3A%22abc%22%7D...&...
```

## Retrieving Raw Init Data

It is a rather common case when the application requires extracting init data in its raw format
to send to a backend server then. You must not use the `retrieveLaunchParams` function and then
manipulate the `tgWebAppData` value, but utilize the `retrieveRawInitData` function designed for
this purpose:

```ts
import { retrieveRawInitData } from '@telegram-apps/bridge';

retrieveRawInitData();
// '{"user":...,"auth_date":...,"query_id":...,...}'
```

The reason is using something else rather than this function, there is no guarantee that the init
data will not become malformed. This is the only function which guarantees that the returned
value will be returned unmodified, as it was passed by the Telegram client.