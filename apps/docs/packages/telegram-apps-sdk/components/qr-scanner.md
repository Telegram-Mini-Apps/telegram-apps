# `QRScanner`

The component which provides the QR scanner functionality.

## Initialization

To initialize the component, use the `initQRScanner` function:

```typescript
import { initQRScanner } from '@telegram-apps/sdk';

const qrScanner = initQRScanner();  
```

## Opening and Closing

To open the QR scanner, the developer should use the `open` method:

```typescript
qrScanner.open('Scan QR code').then((content) => {
  console.log(content);
  // Output: 'some-data=22l&app=93...'
});
console.log(qrScanner.isOpened); // true
```

As a result, the method returns a promise that will be resolved in case some QR
was scanned. It may also resolve `null` if the scanner was closed.

It is allowed to pass an object with optional properties `text` and `capture` responsible
for displaying a text in QR scanner and determining if scanned QR should be captured and promise
should be fulfilled.

```ts
qrScanner.open({ 
  text: 'Scan QR code',
  capture({ data }) {
    // Capture QRs contanining Telegram user link.
    return data.startsWith('https://t.me');
  }
}).then((qr) => {
  // May be something like 'https://t.me/heyqbnk' or null.
  console.log(qr);
});
```

To close the scanner, use the `close` method:

```typescript
qrScanner.close();
console.log(qrScanner.isOpened); // false
```

## Events

List of events, which could be [tracked](../components#events):

| Event             | Listener                   | Triggered when                 |
|-------------------|----------------------------|--------------------------------|
| `change`          | `() => void`               | Something in component changed |
| `change:isOpened` | `(value: boolean) => void` | `isOpened` property changed    |

## Methods Support

List of methods, which could be used in [support checks](../components#methods-support): `open`
and `close`
