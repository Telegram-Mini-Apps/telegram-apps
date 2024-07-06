# `Utils`

Implements functionality that doesn't require state and can't be categorized.

## Initialization

To initialize the component, use the `initUtils` function:

```typescript
import { initUtils } from '@telegram-apps/sdk';

const utils = initUtils();  
```

## Links

### `openLink`

`MiniApp` class is capable of opening links of different types. For example, it can open a link
in an external browser not closing current Mini App, using method `openLink`:

```typescript
utils.openLink('https://google.com');
```

This method also allows opening a link using
Telegram's [Instant View](https://instantview.telegram.org/) when possible:

```typescript
utils.openLink('https://google.com', { tryInstantView: true });
```

To try opening a link using a user preferred browser, use the `tryBrowser` option:

```typescript
utils.openLink('https://google.com', { tryBrowser: true });
```

### `openTelegramLink`

In case, a developer would like to open a link related to Telegram (starting with `https://t.me`) 
the method `openTelegramLink` can be used. 

Using this method, the Telegram application will handle such a link on its own side:

```typescript
utils.openTelegramLink('https://t.me/heyqbnk');
```

### `shareURL`

Sharing a URL is a common functionality in mini applications. To achieve this, a developer can use
the shareURL method, which accepts the URL to be shared and optional text to append to the message
after the URL.

When called, it opens the chat selector to share the URL.

```ts
utils.shareURL('https://t.me/mybot/myapp', 'Look! Some cool app here!');
```

::: warning

Currently, there is no native method to share anything directly. Therefore, this method utilizes
the [openTelegramLink](#opentelegramlink) method, which closes the app after being called. This
method uses [Share links](https://core.telegram.org/api/links#share-links) under the hood.

:::

## Clipboard

Developers are allowed to read the text from the clipboard using the `readTextFromClipboard`
method.

This method reads text from the clipboard and returns a string or null. Null is returned in cases:

- The value in the clipboard is not text.
- Access to the clipboard is not allowed.

```typescript
utils.readTextFromClipboard().then((data) => {
  console.log('Clipboard data:', data);
  // Output: string or null
});
```

## Methods Support

List of methods and parameters, which could be used
in [support checks](../components#methods-support): `readTextFromClipboard`
and `openLink.tryInstantView`
