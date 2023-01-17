# `QRScanner`

Provides QR scanner functionality.

## Init

```typescript
import {QRScanner} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

const scanner = new QRScanner(init(), '6.3');
```

## Opening and closing

To open QR scanner, you should use `open()` method which
accepts optional text displayed to user. As a result, method
returns promise which will be solved in case, some QR was scanned.
It also could return `null` in case, scanner was closed.

```typescript
scanner.open().then(console.log); // some-data=22l&app=93...
console.log(scanner.isOpened); // true
```

To close scanner, use `close()` method:

```typescript
scanner.close();
console.log(scanner.isOpened); // false
```

## Events

Events available for [listening](../about#events):

- `openChanged: (isOpened: boolean) => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `close`
- `open`