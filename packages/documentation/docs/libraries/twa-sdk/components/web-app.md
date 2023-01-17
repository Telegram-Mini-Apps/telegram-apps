# `WebApp`

Provides common Web Apps functionality not covered by other system components.

## Init

```typescript
import {WebApp} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

// Specify bridge instance, Web Apps version and platform name.
const webApp = new WebApp(init(), '6.4', 'webz');
```

## Platform

You could get current Web App platform (`tdesktop`, `webz` etc.) by getting
`platform` property. In case, you want this property to detect current platform
a bit easier, properties `isDesktop` and `isWeb` are used:

```typescript
import {WebApp} from './WebApp';

const webApp = new WebApp(init(), '6.4', 'webz');
console.log(webApp.platform); // webz
```

## Opening links

Here comes the list of methods, which allow opening links with help of Web App:

- `openLink(url: string)` - opens link in external browser. Web App will not be
  closed;
- `openTelegramLink(url: string)` - opens a Telegram link inside Telegram app.
  The Web App will be closed. It expects passing link in full format, with
  hostname "t.me";
- `openInvoice(url: string)` - opens an invoice using its url. It expects
  passing link in full format, with hostname "t.me".

## Other methods

- `close()` - closes Web App;
- `isVersionAtLeast(version: string)` - checks if current `WebApp` instance
  version is higher than passed one;
- `ready()` - should be called whenever Web App is ready to be displayed;
- `readTextFromClipboard(): Promise<string | null>` - reads text
  from clipboard and returns extracted data;
- `sendData(data: string)` - sends data to Telegram bot.

## Methods support

Methods available for [support check](../about#methods-support):

- `openInvoice`
- `readTextFromClipboard`
