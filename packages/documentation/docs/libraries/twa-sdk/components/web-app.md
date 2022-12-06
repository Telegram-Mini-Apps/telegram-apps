# `WebApp`

Provides common Web Apps functionality not covered by other system components.

## Init

`WebApp` requires passing current Web App version and list of optional initial
properties:

```typescript
import {WebApp} from 'twa-sdk';
import {init} from 'twa-bridge';

const webApp = new WebApp('6.0');
// or with custom bridge
const webApp = new WebApp('7.0', {bridge: init()});
// or with some more properties you probably dont need in your code.
const webApp = new WebApp('7.0', {
  bridge: init(),
  headerColor: 'bg_color',
  backgroundColor: '#ffffff',
  isClosingConfirmationEnabled: false,
  platform: 'webz',
});
```

## Colors

### `backgroundColor: RGBColor`

Application background color.

Setter: `setBackgroundColor(color: RGBColor)`

```typescript
webApp.setBackgroundColor('#ffaacc');
console.log(webApp.backgroundColor); // #ffaacc
```

### `headerColor: 'bg_color' or 'secondary_bg_color'`

Application header color.

Setter: `setHeaderColor(color: 'bg_color' or 'secondary_bg_color')`

```typescript
webApp.setHeaderColor('bg_color');
console.log(webApp.headerColor); // bg_color
```

### `colorScheme: 'dark' | 'light'`

To get current color scheme (`dark` or `light`), you can use `colorScheme`
property:

```typescript
console.log(webApp.colorScheme); // dark
```

This property is computed depending on current `backgroundColor`.

## Closing confirmation

To manipulate Web App closing confirmation,
functions `disableClosingConfirmation`
and `enableClosingConfirmation` are used:

```typescript
webApp.enableClosingConfirmation();
console.log(webApp.isClosingConfirmationEnabled); // true

webApp.disableClosingConfirmation();
console.log(webApp.isClosingConfirmationEnabled); // false
```

## Platform

You could get current Web App platform (`tdesktop`, `webz` etc.) by getting
`platform` property. In case, you want this property to detect current platform
a bit easier, properties `isDesktop` and `isWeb` are used:

```typescript
import {WebApp} from './WebApp';

const webApp = new WebApp('7.0', {platform: 'webz'});
console.log(webApp.platform); // webz
console.log(webApp.isAndroid); // false
console.log(webApp.isDesktop); // false
console.log(webApp.isIOS); // false
console.log(webApp.isWeb); // true
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
- `sendData(data: string)` - sends data to Telegram bot.

## Events

Events available for [listening](../about#events):

- `backgroundColorChange: (color: RGBColor) => void`
- `closingConfirmationChange: (isClosingConfirmationEnabled: boolean) => void`
- `headerColorChange: (color: SettableColorKey) => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `openInvoice`
- `setBackgroundColor`
- `setHeaderColor`

You can also use `supports` function with `WebApp` instance:

```typescript
const webApp = new WebApp('6.0');

console.log(webApp.supports('setHeaderColor')); // false
```