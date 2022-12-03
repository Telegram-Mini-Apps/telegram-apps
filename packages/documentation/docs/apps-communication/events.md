---
sidebar_position: 3
toc_max_heading_level: 4
---

# Events

There are a lot of cases, when Telegram sends events to Web App which,
obviously, should be somehow handled. Like methods, each event has its unique
name and payload.

## Web

As mentioned before, web version uses standard way of communication between
iframes. It means, parent iframe is able to send events through
`postMessage` function. To handle this type of message, it is enough to
add `message` event listener on global `window` object.

Native application will send event with `data: string` which represents JSON
object converted to string. This object has the same interface as we defined in
methods section:

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

In this code, we assumed, that `message` event is sent only by native
application which is not always true in real applications. Additionally, we
didn't check if `data` is really `string`. Don't forget to check each type and
appropriately process incoming event.

:::

## Desktop, mobile and Windows Phone

Desktop, mobile and Windows Phone version of Telegram does not use method,
described in previous section. They do it in a bit unusual way. First thing
developer should know, is in case, when Telegram needs to emit event, it will
insert JavaScript code, which calls globally defined function. Here is an
example:

```typescript
window.Telegram.WebView.receiveEvent('popup_closed', {button_id: 'cancel'});
```

Path to this function depends on platform:

- `window.TelegramGameProxy.receiveEvent` - desktop
- `window.Telegram.WebView.receiveEvent` - mobile
- `window.TelegramGameProxy_receiveEvent` - Windows Phone

All of these functions have the same signature:

```typescript
type ReceiveEvent = (eventType: string, eventData: unknown) => void;
```

So, solution is rather simple. To handle incoming event we should create
function of this type and assign to all 3 paths.

## Available events

This section contains list of events, sent from Telegram: their names,
description and parameters. Section title means minimal version, from which
events inside section could be sent.

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

Event, which is usually sent from Telegram web version. Its payload represents
`<style/>` tag html content, developer could use. Stylesheet described in
payload will help developer to stylize app scrollbar (but he is still able to do
it himself).

```typescript
type Payload = string;
```

#### `theme_changed`

Occurs whenever [theme](../features/theme) was changed in the user's Telegram
app (including switching to night mode). `theme_params` property is object with
key-value pairs, where key is some key name (`bg_color`, `secondary_bg_color`,
...), and value is its color in `#RRGGBB` format.

```typescript
type Payload = { theme_params: Record<string, string> };
```

#### `viewport_changed`

Occurs whenever [viewport](../features/viewport) has been changed. For example,
when user started dragging application or called expansion method.

Pay attention to fact, that send rate of this method is not enough to smoothly
resize application window. You should probably use stable height instead of
current one, or handle this problem in other way.

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