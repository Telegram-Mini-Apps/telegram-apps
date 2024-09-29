# Links

## `openLink`

To open a link in an external browser or using [Instant View](https://instantview.telegram.org/),
use the `openLink` method. You can also pass an optional second argument, an object with optional
properties `tryBrowser: OpenLinkBrowser (string)` and `tryInstantView: boolean`.

```ts
import { openLink } from '@telegram-apps/sdk';

openLink('https://telegram.org', {
  tryBrowser: 'chrome',
  tryInstantView: true,
});
```

## `openTelegramLink`

To open a Telegram link with predefined behavior, use the `openTelegramLink` method. This method
allows you to apply the native behavior as described in
the [Deep Links](https://core.telegram.org/api/links) documentation.

```ts
import { openTelegramLink } from '@telegram-apps/sdk';

openTelegramLink('https://t.me/heyqbnk');
```

## `shareURL`

To share a URL with another user, channel, or group, use the `shareURL` method.

```ts
import { shareURL } from '@telegram-apps/sdk';

shareURL('https://t.me/heyqbnk', 'Check out this cool group!');
```