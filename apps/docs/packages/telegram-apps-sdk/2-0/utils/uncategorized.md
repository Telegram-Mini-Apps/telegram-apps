# Uncategorized

## `readTextFromClipboard`

To read text from the clipboard, use the `readTextFromClipboard` function.

```ts
import { readTextFromClipboard } from '@telegram-apps/sdk';

if (readTextFromClipboard.isSupported()) {
  const contents = await readTextFromClipboard(); // string | null
}
```

## `sendData`

To send data to the bot, use the `sendData` function. This function sends a service message to the
bot and closes the Mini App.

```ts
import { sendData } from '@telegram-apps/sdk';

sendData('my-data-goes-here');
```

> [!TIP]
> This function sends data up to 4096 bytes to the bot and is available for Mini Apps launched via a
> Keyboard button.

> [!WARNING]
> This function is only accessible for Mini Apps started through a Keyboard button. See
> the `web_app_data` field in the [Message](https://core.telegram.org/bots/api#message) class for
> more details.

## `switchInlineQuery`

To create a message prefixed with the bot username and a specific text, and share it in another
chat, use the `switchInlineQuery` method. You can use the second optional argument to specify which
chat types can be selected to send the message.

```ts
import { switchInlineQuery } from '@telegram-apps/sdk';

if (switchInlineQuery.isSupported()) {
  await switchInlineQuery('Check this bot!', [
    'users',
    'bots',
    'groups',
    'channels',
  ]);
}
```
