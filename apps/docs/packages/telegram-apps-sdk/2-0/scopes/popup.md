# Popup

The scope responsible for the Telegram Mini Apps [popup](../../../../platform/popup.md).

## Opening

To open a popup, it is required to call the `open` method specifying popup properties: title,
message, and a list of up to 3 buttons.

The method returns a promise, which will be fulfilled with the clicked button identifier. In the
case where the user didn't click any button, the method will return `null`.

Calling the method updates the `isOpened` signal property value.

::: code-group

```ts [Using object]
import { popup } from '@telegram-apps/sdk';

if (popup.open.isSupported()) {
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

```ts [Using function]
import { openPopup, isPopupOpened } from '@telegram-apps/sdk';

if (openPopup.isSupported()) {
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
