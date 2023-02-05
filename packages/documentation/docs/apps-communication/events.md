---
sidebar_position: 3
---

# Events

There are a lot of cases, when Telegram sends events to Web App which,
obviously, should be somehow handled. Like methods, each event has its unique
name and payload.

## Web

As mentioned before, the web version uses a standard way of communication
between iframes. It means, the parent iframe is able to send events
through `postMessage` function. To handle this type of message, it is enough to
add `message` event listener on the global `window` object.

The native application will send an event with `data: string` which represents a
JSON object converted to string. This object has the same interface as we
defined in the methods section:

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

Simple example:

```typescript
window.addEventListener('message', ({data}) => {
  const {eventType, eventData} = JSON.parse(data);
  console.log(eventType, eventData);
})
```

:::caution

In this code, we assumed, that `message` event is sent only by the native
application which is not always true in real applications. Additionally, we
didn't check if `data` is really of type `string`. Don't forget to check each
type and appropriately process incoming events.

:::

## Desktop, mobile and Windows Phone

Desktop, mobile, and Windows Phone versions of Telegram don’t use the method,
described in the previous section. They do it in a bit unusual way. The first
thing developer should know, is in case, when Telegram needs to emit an event,
it will insert JavaScript code, which calls a globally defined function. Here is
an example:

```typescript
window.Telegram.WebView.receiveEvent('popup_closed', {button_id: 'cancel'});
```

Path to this function depends on platform:

- `window.TelegramGameProxy.receiveEvent` - Telegram Desktop;
- `window.Telegram.WebView.receiveEvent` - mobile applications;
- `window.TelegramGameProxy_receiveEvent` - Windows Phone

All of these functions have the same signature:

```typescript
type ReceiveEvent = (eventType: string, eventData: unknown) => void;
```

So, the solution is rather simple. To handle incoming events we should create a
function of this type and assign it to all 3 paths.

## Available events

This section contains the list of events, sent from Telegram: their names,
description, and parameters. Section title means minimal version, from which
events inside the section could be sent.

### v6.0

#### `invoice_closed`

Invoice closed. Event contains passed
during [`web_app_open_invoice`](methods#web_app_open_invoice) method
invocation `slug` and invoice status.

```typescript
type Payload = {
  slug: string;
  status: 'paid' | 'failed' | 'pending' | 'cancelled';
}
```

#### `main_button_pressed`

User clicked [main button](../features/main-button).

#### `popup_closed`

[Popup](../features/popup) was closed. Payload will contain `button_id` property
which is identifier of clicked button. In case, no button was clicked, payload
will be empty object `{}`.

```typescript
type Payload = { button_id?: string }
```

#### `set_custom_style`

The event is usually sent in the Telegram web version. Its payload
represents `<style/>` tag html content, a developer could use. The stylesheet
described in the payload will help the developer to stylize the app scrollbar
(but he is still able to do it himself).

```typescript
type Payload = string;
```

#### `theme_changed`

Occurs whenever [the theme](../features/theme) was changed in the user's
Telegram app (including switching to night mode).`theme_params` property is an
object with key-value pairs, where the key is some key
name (`bg_color`, `secondary_bg_color`, etc.), and the value is its color
in `#RRGGBB`format.

```typescript
type Payload = { theme_params: Record<string, string> };
```

#### `viewport_changed`

Occurs whenever the [viewport](../features/viewport) has been changed. For
example, when the user started dragging the application or called the expansion
method.

Pay attention to the fact, that send rate of this method is not enough to
smoothly resize the application window. You should probably use a stable height
instead of the current one, or handle this problem in another way.

```typescript
type Payload = {
  height: number;
  width?: number;
  is_expanded: boolean;
  is_state_stable: boolean;
};
```

### v6.1

#### `back_button_pressed`

User clicked [back button](../features/back-button).

#### `settings_button_pressed`

Occurs when the `Settings` item in context menu was pressed. Not all
applications have this button.

### v6.4

#### `qr_text_received`

QR scanner scanned some QR and extracted its content.

```typescript
type Payload = {
  req_id: string;
  data?: string | null;
};
```

#### `scan_qr_popup_closed`

QR scanner was closed.

#### `clipboard_text_received`

Telegram application attempted to extract text from clipboard.

```typescript
type Payload = {
  data?: string;
};
```