# Popup

The 💠[component](../scopes.md) responsible for the Telegram Mini Apps [popup](../../../../platform/popup.md).

## Checking Support

To check if the popup is supported by the current Telegram Mini Apps version, the
`isSupported` method is used:

::: code-group

```ts [Variable]
import { popup } from '@telegram-apps/sdk';

popup.isSupported(); // boolean
```

```ts [Functions]
import { isPopupSupported } from '@telegram-apps/sdk';

isPopupSupported(); // boolean
```

:::

## Opening

To open a popup, it is required to call the `open` method specifying popup properties: title,
message, and a list of up to 3 buttons.

The method returns a promise, which will be fulfilled with the clicked button identifier. In the
case where the user didn't click any button, the method will return `null`.

Calling the method updates the `isOpened` signal property value.

::: code-group

```ts [Variable]
import { popup } from '@telegram-apps/sdk';

if (popup.open.isAvailable()) {
  // popup.isOpened() -> false
  const promise = popup.open({
    title: 'Hello!',
    message: 'Here is a test message.',
    buttons: [{ id: 'my-id', type: 'default', text: 'Default text' }],
  });
  // popup.isOpened() -> true
  const buttonId = await promise;
  // popup.isOpened() -> false
}
```


```ts [Functions]
import { openPopup, isPopupOpened } from '@telegram-apps/sdk';

if (openPopup.isAvailable()) {
  // isPopupOpened() -> false
  const promise = openPopup({
    title: 'Hello!',
    message: 'Here is a test message.',
    buttons: [{ id: 'my-id', type: 'default', text: 'Default text' }],
  });
  // isPopupOpened() -> true
  const buttonId = await promise;
  // isPopupOpened() -> false
}
```

:::
