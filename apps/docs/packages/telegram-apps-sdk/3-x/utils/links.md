# Links

## `openLink`

To open a link in an external browser or using [Instant View](https://instantview.telegram.org/),
use the `openLink` method. You can also pass an optional second argument, an object with optional
properties `tryBrowser: OpenLinkBrowser (string)` and `tryInstantView: boolean`.

::: code-group

```ts [Using isAvailable]
import { openLink } from '@telegram-apps/sdk';

if (openLink.isAvailable()) {
  openLink('https://telegram.org', {
    tryBrowser: 'chrome',
    tryInstantView: true,
  });
}
```

```ts [Using ifAvailable]
import { openLink } from '@telegram-apps/sdk';

openLink.ifAvailable('https://telegram.org', {
  tryBrowser: 'chrome',
  tryInstantView: true,
});
```

:::

## `openTelegramLink`

To open a Telegram link with predefined behavior, use the `openTelegramLink` method. This method
allows you to apply the native behavior as described in
the [Deep Links](https://core.telegram.org/api/links) documentation.

::: code-group

```ts [Using isAvailable]
import { openTelegramLink } from '@telegram-apps/sdk';

if (openTelegramLink.isAvailable()) {
  openTelegramLink('https://t.me/heyqbnk');
}
```

```ts [Using ifAvailable]
import { openTelegramLink } from '@telegram-apps/sdk';

openTelegramLink.ifAvailable('https://t.me/heyqbnk');
```

:::

## `shareURL`

To share a URL with another user, channel, or group, use the `shareURL` method.

::: code-group

```ts [Using isAvailable]
import { shareURL } from '@telegram-apps/sdk';

if (shareURL.isAvailable()) {
  shareURL('https://t.me/heyqbnk', 'Check out this cool group!');
}
```

```ts [Using ifAvailable]
import { shareURL } from '@telegram-apps/sdk';

shareURL.ifAvailable(
  'https://t.me/heyqbnk', 
  'Check out this cool group!',
);
```

:::
