---
sidebar_position: 1
---

# Definition

## Web

As long as web version of Telegram displays front-end application in `<iframe/>`
tag, it uses default way of communication between 2 iframes - sending messages
through `window.parent.postMessage(message, origin)` function.

As the first parameter, you should pass JSON object **converted to string**.
Object should have this interface:

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

The second parameter is `targetOrigin` - allowed parent iframe origin. We
recommend avoiding usage of wildcard `*` as long as it is not secure - your
application could be inserted not by Telegram, but other iframe which will still
able to communicate with your app and receive some data.

As default value, you could use `https://web.telegram.org`.

So, as you see, each method has its own name expressed by `eventType`
and parameters stored in `eventData` property. Here is the usage example:

```typescript
window.parent.postMessage(JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: {is_visible: true},
}), 'https://web.telegram.org');
```

This code will make Telegram back button appear. We will define back button and
other components in the next sections of documentation.

## Desktop and mobile

Unlike web, desktop and mobile applications use a bit more unusual way of
calling methods. Both of these platforms will create global function
`window.TelegramWebviewProxy.postEvent(eventType: string, eventData: string)`
.

As the first argument, this function accepts event name. The second one -
parameters object, converted to string. Here is how it works:

```typescript
window.TelegramWebviewProxy.postEvent('web_app_setup_back_button', JSON.stringify({
  is_visible: true
}));
```

## Windows Phone

Telegram Windows Phone app provides such function as
`window.external.notify(message: string)`. It accepts the same parameter as web
version does:

```typescript
window.external.notify(JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: {is_visible: true},
}))
```

:::info

This method is probably not used by Telegram already, but we still should
describe how it works in legacy version of Telegram Windows Phone.

:::
