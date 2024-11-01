# QR 扫描仪

提供 QR 扫描仪功能的💠[组件](../scopes.md)。

## 开幕和闭幕

要打开 QR 扫描仪，开发人员应使用 `open` 方法。 它接受可选的 `text`
属性，负责显示扫描仪标题属性，具体取决于打开的样式。

反过来，调用 `open` 方法会更新 `isOpened` 信号属性值。

要关闭扫描仪，请使用 `close` 方法。

### 回调样式

接受 "onCaptured "选项，这是一个接收扫描的 QR 内容的函数。 该方法
返回一个承诺，该承诺将在扫描仪关闭后解析。

::: code-group

```ts [Variable]
import { qrScanner } from '@telegram-apps/sdk';

if (qrScanner.open.isSupported()) {
  qrScanner.isOpened(); // false
  const promise = qrScanner.open({
    text: 'Scan the QR',
    onCaptured(qr) {
      if (qr === 'qr-content-we-expect') {
        qrScanner.close();
      }.
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

if (openQrScanner.isSupported()) {
  isQrScannerOpened(); // false
  const promise = openQrScanner({
    text: 'Scan the QR',
    onCaptured(qr) {
      if (qr === 'qr-content-we-expect') {
        closeQrScanner();
      } }.
    },
  });
  isQrScannerOpened(); // true
  await promise;
  isQrScannerOpened(); // true
}
```

:::

### 承诺风格

接受可选的 "capture "选项，接收扫描的 QR 内容，如果应该捕获并承诺解决，则返回 "true"。 如果省略，将解析第一个捕获的
QR 内容。 如果由于某种原因扫描仪被关闭
，则承诺可能被解析为 "未定义"。

::: code-group

```ts [Variable]
import { qrScanner } from '@telegram-apps/sdk';

if (qrScanner.open.isSupported()) {
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

if (openQrScanner.isSupported()) {
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
