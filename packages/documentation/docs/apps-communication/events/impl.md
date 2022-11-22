---
sidebar_position: 1
---

# Implementation

In previous section we already mentioned, that each Telegram app has its
own specific logic connected with methods calling. We can say the same about
events receiving.

There are a log of cases, when Telegram app sends events to front-end
application which, obviously, should be somehow handled. Like methods, each
event has its unique name and payload.

## Web

As mentioned before, web version uses standard way of communication between
iframes. It means, parent iframe is able to send events through
`iframe.postMessage` function. To handle this type of message, it is enough
to add `message` event listener on global `window` object.

Native application will send event with `data: string` which represents JSON
object converted to string. This object should have this interface:

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

Simple example:

```typescript
window.addEventListener('message', ({data}) => {
  // data is assumed to be string
  const {eventType, eventData} = JSON.parse(data);
  console.log(eventType, eventData);
})
```

In this code, we assumed, that `message` event is sent only by native
application what is not always true in real applications. In your code, don't
forget to check each type and appropriately process incoming event.

## Desktop, mobile and Windows phone

To handle desktop and mobile applications, we should create our own function
of this type:

```typescript
type ReceiveEvent = (eventType: string, eventData: unknown) => void;
```

Then, assign it to these paths:

- `window.Telegram.WebView.receiveEvent`
- `window.TelegramGameProxy.receiveEvent`
- `window.TelegramGameProxy_receiveEvent`

As you can assume, in case, when some event should be emitted, native
application inserts JavaScript code which calls one of the functions above with
required parameters. For example:

```typescript
window.Telegram.WebView.receiveEvent('popup_closed', {button_id: null});
```

##     
