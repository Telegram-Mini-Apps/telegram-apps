# `WebApp`

The component which provides the common Telegram Mini Apps functionality not covered by other system
components.

## Initialization

Component constructor accepts header and background colors, Telegram Mini Apps version and platform,
function to generate request identifiers for called Telegram Mini Apps methods and optional function
to call them.

```typescript
import { postEvent } from '@tma.js/bridge';
import { WebApp } from '@tma.js/sdk';

const webApp = new WebApp(
  'bg_color',
  '#00ae13',
  '6.4',
  'webz',
  () => Math.random().toString(),
  postEvent,
);
```

## Platform

You could get current Telegram Mini
Apps [platform](../../../../docs/about-platform.md#supported-applications) by getting `platform`
property.

## Opening links

Here comes the list of methods, which allow opening links with help of `WebApp`:

- `openLink(url: string)` - opens link in external browser. Mini App will not be closed.
- `openTelegramLink(url: string)` - opens a Telegram link inside Telegram app. The Mini App will be
  closed. It expects passing link in full format, with hostname "t.me".
- `openInvoice(url: string)` - opens an invoice using its url. It expects passing link in full
  format, with hostname "t.me".

## Header and background

You are able to get and update header and background colors. To get current values of these blocks,
you should refer to `headerColor` and `backgroundColor` properties. To update them,
use `setHeaderColor(colorKey: HeaderColorKey)` and `setBackgroundColor(color: RGB)` methods.

## Other methods

- `close()` - closes Mini App.
- `isVersionAtLeast(version: string)` - checks if current `WebApp` instance version is higher than
  passed one.
- `ready()` - should be called whenever Mini App is ready to be displayed.
- `readTextFromClipboard(): Promise<string | null>` - reads text
  from clipboard and returns extracted data.
- `sendData(data: string)` - sends data to Telegram bot.
- `switchInlineQuery(text: string, chatTypes: string[])` - sends bot username and specified text
  to the chat, selected by user.

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `backgroundColorChanged: (color: RGB) => void`
- `headerColorChanged: (color: HeaderColorKey | RGB) => void`

## Methods support

List of methods, which could be used in `supports` component instance method:

- `openInvoice` - to check if the `openInvoice` method supported.
- `readTextFromClipboard` - to check if the `readTextFromClipboard` method supported.
- `setHeaderColor` - to check if the `setHeaderColor` method supported.
- `setBackgroundColor` - to check if the `setBackgroundColor` method supported.
