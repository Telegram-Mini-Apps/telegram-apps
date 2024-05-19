# `Utils`

Implements functionality that doesn't require state and can't be categorized.

## Initialization

To initialize the component, use the `initUtils` function:

```typescript
import { initUtils } from '@tma.js/sdk';

const utils = initUtils();  
```

## Links

### `openLink`

`MiniApp` class is capable of opening links of different types. For example, it can open a link
in an external browser not closing current Mini App, using method `openLink`:

```typescript
utils.openLink('https://google.com');
```

### `openTelegramLink`

In case, developer would like to open a link related to Telegram (starting with `https://t.me`) he
could utilize such method as `openTelegramLink`. In this case Telegram application
will handle such link on its own side:

```typescript
utils.openTelegramLink('https://t.me/heyqbnk');
```

In this case, Telegram application will open the group with name `heyqbnk`.

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
