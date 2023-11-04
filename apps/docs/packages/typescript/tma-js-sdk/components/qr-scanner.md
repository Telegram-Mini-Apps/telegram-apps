# `QRScanner`

The component which provides the QR scanner functionality.

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call Telegram Mini
Apps methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { QRScanner } from '@tma.js/sdk';

const scanner = new QRScanner('6.3', postEvent);
```

## Opening and closing

To open the QR scanner, developer should use the `open()` method which accepts an optional text
displayed to a user. As the result, method returns a promise which will be resolved in case, some
QR was scanned. It also could return `null` in case, scanner was closed.

Opening and closing QR scanner updates it's `isOpened` property.

```typescript
scanner.open().then(console.log); // some-data=22l&app=93...
console.log(scanner.isOpened); // true
```

To close the scanner, use `close()` method:

```typescript
scanner.close();
console.log(scanner.isOpened); // false
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `isOpenedChanged: (isOpened: boolean) => void`

## Methods support

List of methods, which could be usethe d in `supports` component instance method:

- `open` - to check if the `open` method supported.
- `close` - to check if the  `close` method supported.
