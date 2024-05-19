# `QRScanner`

The component which provides the QR scanner functionality.

## Initialization

To initialize the component, use the `initQRScanner` function:

```typescript
import { initQRScanner } from '@tma.js/sdk';

const qrScanner = initQRScanner();  
```

## Opening and Closing

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

List of events, which could be [tracked](../components#events):

| Event             | Listener                   | Triggered when                 |
|-------------------|----------------------------|--------------------------------|
| `change`          | `() => void`               | Something in component changed |
| `change:isOpened` | `(value: boolean) => void` | `isOpened` property changed    |

## Methods Support

List of methods, which could be used in [support checks](../components#methods-support): `open`
and `close`