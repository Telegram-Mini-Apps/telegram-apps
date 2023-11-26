# `QRScanner`

The component which provides the QR scanner functionality.

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call Telegram Mini
Apps methods.

```typescript
import { QRScanner, postEvent } from '@tma.js/sdk';

const scanner = new QRScanner('6.3', postEvent);
```

## Opening and closing

To open the QR scanner, the developer should use the `open` method, which accepts optional text
displayed to a user. As a result, the method returns a promise that will be resolved in case some QR
was scanned. It could also return `null` in case the scanner was closed.

```typescript
scanner.open('Scan the barcode').then((content) => {
  console.log(content);
  // Output: 'some-data=22l&app=93...'
});
console.log(scanner.isOpened); // true
```

To close the scanner, use the `close` method:

```typescript
scanner.close();
console.log(scanner.isOpened); // false
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event           | Listener                   | Triggered when                 |
|-----------------|----------------------------|--------------------------------|
| change          | `() => void`               | Something in component changed |
| change:isOpened | `(value: boolean) => void` | `isOpened` property changed    |

## Methods support

List of methods, which could be used in `supports` component instance method:

- `open`
- `close`

```typescript
import { QRScanner } from '@tma.js/sdk';

const qrScanner = new QRScanner(...);
qrScanner.supports('open');
qrScanner.supports('close');
```
