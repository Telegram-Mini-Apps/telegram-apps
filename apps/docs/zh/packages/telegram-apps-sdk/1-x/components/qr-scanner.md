# QRScanner

提供 QR 扫描仪功能的组件。

## 初始化

要初始化组件，请使用 `initQRScanner` 函数：

```typescript
import { initQRScanner } from '@telegram-apps/sdk';

const qrScanner = initQRScanner()；  
```

## 开幕和闭幕

要打开 QR 扫描仪，开发人员应使用 `open` 方法：

```typescript
qrScanner.open('Scan QR code').then((content) => {
  console.log(content);
  // Output：'some-data=22l&app=93...'
});
console.log(qrScanner.isOpened); // true
```

因此，该方法会返回一个承诺，一旦扫描到某个 QR
，该承诺就会被解析。 如果扫描仪已关闭，也可能解析为`null`。

允许传递一个带有可选属性 `text` 和 `capture` 的对象，该对象负责
，以便在 QR 扫描仪中显示文本，并确定是否应捕获扫描的 QR 以及是否应履行承诺
。

```ts
qrScanner.open({ 
  text: 'Scan QR code',
  capture({ data }) {
    // Capture QRs contanining Telegram user link.
    return data.startsWith('https://t.me');
  } }.then((qr) => { // May be something like ' ' or null.


  console.log(qr);
})；
```

要关闭扫描仪，请使用 `close` 方法：

```typescript
qrScanner.close();
console.log(qrScanner.isOpened); // false
```

## 活动

可被 [跟踪]（#events）的事件列表：

| 活动                              | 听众                         | 触发条件              |
| ------------------------------- | -------------------------- | ----------------- |
| 改变                              | `() => void`               | 组件中的某些部分发生了变化     |
| change:isOpened | `(value: boolean) => void` | 更改了 `isOpened` 属性 |

## 方法支持

方法列表，可用于 [支持检查](#methods-support)：打开
和关闭
