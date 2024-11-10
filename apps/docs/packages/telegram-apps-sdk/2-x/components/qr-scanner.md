# QR Scanner

The 💠[component](../scopes.md) which provides the QR scanner functionality.

## Opening and Closing

To open the QR scanner, a developer should use the `open` method. It accepts the optional `text`
property responsible for displaying the scanner title properties, depending on the open style.

In turn, calling the `open` method updates the `isOpened` signal property value.

To close the scanner, use the `close` method.

### Callback Style

Accepts the `onCaptured` option, which is a function receiving the scanned QR content. This method
returns a promise which will be resolved upon the scanner was closed.

::: code-group

```ts [Variable]
import { qrScanner } from '@telegram-apps/sdk';

if (qrScanner.open.isAvailable()) {
  qrScanner.isOpened(); // false
  const promise = qrScanner.open({
    text: 'Scan the QR',
    onCaptured(qr) {
      if (qr === 'qr-content-we-expect') {
        qrScanner.close();
      }
    },
  });
  qrScanner.isOpened(); // true
  await promise;
  qrScanner.isOpened(); // false
}
```

```ts [Functions]
import {
  openQrScanner,
  closeQrScanner,
  isQrScannerOpened,
} from '@telegram-apps/sdk';

if (openQrScanner.isAvailable()) {
  isQrScannerOpened(); // false
  const promise = openQrScanner({
    text: 'Scan the QR',
    onCaptured(qr) {
      if (qr === 'qr-content-we-expect') {
        closeQrScanner();
      }
    },
  });
  isQrScannerOpened(); // true
  await promise;
  isQrScannerOpened(); // true
}
```

:::

### Promise Style

Accepts the optional `capture` option receiving the scanned QR content and
returning `true` if it should be captured and promise resolved. If omitted, the first captured
QR content will be resolved. The promise may be resolved to `undefined`, if the scanner was closed
due to some reason.

::: code-group

```ts [Variable]
import { qrScanner } from '@telegram-apps/sdk';

if (qrScanner.open.isAvailable()) {
  // Getting the first captured QR.
  qrScanner.isOpened(); // false
  let promise = qrScanner.open({ text: 'Scan any QR' });
  qrScanner.isOpened(); // true
  await promise;
  qrScanner.isOpened(); // false

  // Getting some specific QR.
  qrScanner.isOpened(); // false
  promise = qrScanner.open({
    text: 'Scan some specific QR',
    capture(qr) {
      return qr === 'some-specific-qr';
    },
  });
  qrScanner.isOpened(); // true
  await promise;
  qrScanner.isOpened(); // false
}
```

```ts [Functions]
import {
  openQrScanner,
  closeQrScanner,
  isQrScannerOpened,
} from '@telegram-apps/sdk';

if (openQrScanner.isAvailable()) {
  // Getting the first captured QR.
  // isQrScannerOpened() -> false
  let promise = openQrScanner({ text: 'Scan any QR' });
  // isQrScannerOpened() -> true
  await promise;
  // isQrScannerOpened() -> false

  // Getting some specific QR.
  // isQrScannerOpened() -> false
  promise = openQrScanner({
    text: 'Scan some specific QR',
    capture(qr) {
      return qr === 'some-specific-qr';
    },
  });
  // isQrScannerOpened() -> true
  await promise;
  // isQrScannerOpened() -> false
}
```

:::