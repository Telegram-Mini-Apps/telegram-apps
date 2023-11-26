---
outline: [2, 3]
---

# `MiniApp`

The component which provides the common Telegram Mini Apps functionality not covered by other system
components.

## Initialization

The component constructor accepts an object with specified header and background colors, Telegram
Mini Apps version, current bot inline mode, and an optional function to call Telegram Mini Apps
methods.

headerColor: MiniAppHeaderColor;
backgroundColor: RGB;
version: Version;
botInline: boolean;
postEvent?: PostEvent;

```typescript
import { MiniApp, postEvent } from '@tma.js/sdk';

const miniApp = new MiniApp({
  headerColor: 'bg_color',
  backgroundColor: '#00ae13',
  version: '6.4',
  botInline: false,
  postEvent,
});
```

## Colors

### Header

Developer is able to get and update Mini App header and background colors. To get current value
of header color, developer could refer to the `headerColor` property and update it via
`setHeaderColor` method:

```typescript
console.log(miniApp.headerColor); // 'bg_color'

miniApp.setHeaderColor('secondary_bg_color');
// or starting from v6.10:
miniApp.setHeaderColor('#aa1132');
```

### Background

As well as Mini App header color, developer is also able to manipulate its background color:

```typescript
console.log(miniApp.backgroundColor); // '#00ae13'
miniApp.setBackgroundColor('#888311');
```

Mini App background color is used to determine if current Mini App has dark palette. To know
if current palette is dark, developer should use `isDark` property:

```typescript
console.log(miniApp.isDark); // false
```

## Access requests

Starting from Telegram Mini Apps version 6.9, Mini Apps are allowed to request access to the phone
number and request access to write the current user. To do so, developers are allowed to use
the `requestPhoneAccess` and `requestWriteAccess` methods:

```typescript
miniApp.requestPhoneAccess().then(() => {
  // done.
});

miniApp.requestWriteAccess().then(() => {
  // done.
});
```

## Inline mode

Mini Apps are available to be launched in [inline mode](https://core.telegram.org/bots/inline). When
a Mini App is launched in such a mode, the developer is allowed to use the `switchInlineQuery`
method:

```typescript
miniApp.switchInlineQuery('Show me something', ['users', 'groups']);
```

When calling this method, the Telegram application sends the bot username and the specified text to
the chat selected by the user. The list of available chats will be restricted by the chat types
specified in the second argument.

To check if the current Mini App is launched in inline mode, the developer should refer to
the `isBotInline` property:

```typescript
console.log(miniApp.isBotInline); // false
```

## Lifecycle methods

### `ready`

Informs the Telegram app that the Mini App is ready to be displayed.

It is recommended to call this method as early as possible, as soon as all essential interface
elements loaded. Once this method called, the loading placeholder is hidden and the Mini App shown.

If the method not called, the placeholder will be hidden only when the page fully loaded.

```typescript
miniApp.ready();
```

### `close`

Closes the Mini App.

```typescript
miniApp.close();
```

## Other methods

### `sendData`

A method used to send data to the bot. When this method is called, a service message is sent to the
bot containing data of a length up to 4096 bytes, and the Mini App is closed. Refer to
the `web_app_data` field in the [Message](https://core.telegram.org/bots/api#message) class.

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event                  | Listener                                 | Triggered when                     |
|------------------------|------------------------------------------|------------------------------------|
| change                 | `() => void`                             | Something in component changed     |
| change:backgroundColor | `(value: RGB) => void`                   | `backgroundColor` property changed |
| change:headerColor     | `(value: HeaderColorKey or RGB) => void` | `headerColor` property changed     |

## Methods support

List of methods, which could be used in `supports` component instance method:

- `requestWriteAccess`
- `requestPhoneAccess`
- `switchInlineQuery`
- `setHeaderColor`
- `setBackgroundColor`

```typescript
miniApp.supports('requestWriteAccess');
miniApp.supports('requestPhoneAccess');
miniApp.supports('switchInlineQuery');
miniApp.supports('setHeaderColor');
miniApp.supports('setBackgroundColor'); 
```

## Method parameters support

List of method parameters, which could be used in `supportsParam` component instance method:

- `setHeaderColor.color`

```typescript
miniApp.supportsParam('setHeaderColor.color');
```