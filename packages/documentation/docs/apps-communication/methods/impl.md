---
sidebar_position: 1
---

# Implementation

To be more accurate, Telegram Web Apps is not new technology even in world
of Telegram. Messenger already has such technology as Telegram Games, which is,
internally, is almost the same platform as Web Apps. At least, it uses the same
way of communication with front-end app.

It is currently not known why each platform has its own communication logic,
but we have what we have.

## Web

As long as web version of Telegram displays front-end application in `<iframe/>`
tag, it uses default way of communication between 2 iframes - sending
messages through `window.parent.postMessage(message, origin)` function.

As the first parameter, you should pass JSON object converted to string. Object
should have this signature:

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

The second parameter is `targetOrigin` - allowed parent iframe origin. We
recommend avoiding usage of wildcard `*` as long as it is not secure.

So, as you could notice, each method has its own name expressed by `eventType`
and parameters stored in `eventData` property. Let's see how we should use it:

```typescript
window.parent.postMessage(JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: {is_visible: true},
}), 'https://web.telegram.org');
```

This code will make Telegram back button appear. We will define back button
in the next sections of documentation.

## Desktop and mobile

Unlike web, desktop and mobile applications use a bit more unusual way of
calling methods. Both of these platforms will create global functions,
accessible by path `window.TelegramWebviewProxy.postEvent`. As the first
argument, this function accepts event name. The second one - parameters object,
converted to string.

Here is how it works:

```typescript
window.TelegramWebviewProxy.postEvent('web_app_setup_back_button', JSON.stringify({
  is_visible: true
}));
```

## Windows Phone

Telegram Windows Phone app provides such function as
`window.external.notify(message: string)`. It accepts the same parameter as
web version does:

```typescript
window.external.notify(JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: {is_visible: true},
}))
```

:::tip

This method is probably not used by Telegram already, but we still should
describe how it works in legacy version of Telegram Windows Phone.

:::
