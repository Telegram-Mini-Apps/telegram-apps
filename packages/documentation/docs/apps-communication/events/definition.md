---
sidebar_position: 1
---

# Definition

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
didn't check if `data` is really `string`. In your code, don't
forget to check each type and appropriately process incoming event.

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
