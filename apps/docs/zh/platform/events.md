---
outline:
  - 2
  - 3
---

# 活动

事件是 Telegram 本地应用程序在
完成某些外部操作时发送的信号。 与方法一样，每个事件都有自己独特的名称和参数。

## 网络

如前所述，网络版使用 iframe 之间的标准通信方式。 这意味着
父 iframe 可以通过 `window.postMessage` 函数发送事件。 要处理这类
消息，只需在全局 `window` 对象上添加 `message` 事件监听器即可：

```typescript
window.addEventListener('message', ...)；
```

本地应用程序将发送一个带有 `data: string` 的事件，该字符串代表已转换为字符串的 JSON 对象
。 该对象的接口与我们在
[方法](methods.md#web) 部分中定义的接口相同：

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

然后，让我们想象一下如何处理 Telegram 应用程序中的事件：

```typescript
window.addEventListener('message', ({ data }) => {
  const { eventType, eventData } = JSON.parse(data);
  console.log(eventType, eventData);
})；
```

::: warning

在这段代码中，我们假设 "消息 "事件只由本地应用程序发送，但在实际应用中，这并不总是正确的。 此外，我们没有检查 `data` 是否真的属于
类型 `string`。 不要忘记检查每种类型，并适当处理传入的事件。

:::

## 台式机、手机和 Windows Phone

桌面版、手机版和 Windows Phone 版 Telegram 不使用
上一节所述的方法。 他们的方式有点不同寻常。 开发人员首先要知道，在
的情况下，当 Telegram 需要发出事件时，它会插入 JavaScript 代码，调用全局
定义的函数。

下面就是一个例子：

```typescript
window.Telegram.WebView.receiveEvent('popup_closed', {
  button_id: 'cancel'
})；
```

该功能的路径取决于平台：

- `window.TelegramGameProxy.receiveEvent` - Telegram 桌面；
- `window.Telegram.WebView.receiveEvent` - 适用于 iOS 和 Android 的 Telegram；
- window.TelegramGameProxy_receiveEvent\` - Windows Phone

所有这些函数都有相同的签名：

```typescript
type ReceiveEvent = (eventType: string, eventData: unknown) => void；
```

因此，解决办法相当简单。 为了处理传入的事件，我们应该创建一个
类型的函数，并将其分配给所有 3 条路径。

## 聆听活动

为开发人员的应用程序处理所有可能的环境是一项挑战。 为了简化
这一过程，社区开发了 [@telegram-apps/sdk](../packages/telegram-apps-sdk/2-x)
软件包，大大简化了集成工作。

下面介绍如何使用它：

```ts
import { on } from '@telegram-apps/sdk';

// 开始监听 "viewport_changed "事件。
// 返回值是一个函数，用于移除此事件监听器。
const removeListener = on('viewport_changed', payload => {
  console.log('Viewport changed:', payload);
});

// 移除此事件监听器。
removeListener()；
```

有关调用方法的更多信息，请参阅
软件包的 [documentation](../packages/telegram-apps-bridge/events.md#listening-to-events) 。

## 现有活动

本节包含从 Telegram 发送的事件列表：名称、描述和
参数。 小节标题指最小版本，小节内的事件可从该版本发送。

### `back_button_pressed` 返回按键

自**v6.1**

用户点击了 [返回按钮]（back-button.md）。

### 已请求生物测量

自**v7.2**

生物测量认证请求已完成。 该事件通常发生在对
[web_app_request_auth](methods.md#web-app-biometry-request-auth) 方法的响应中。

如果身份验证成功，事件中就会包含一个来自本地安全存储的令牌。

| 现场  | 类型          | 说明                                                      |
| --- | ----------- | ------------------------------------------------------- |
| 地位  | 失败 "或 "授权"。 | 验证状态。                                                   |
| 象征性 | 字符串         | _可选_。 之前保存的本地安全存储器中的令牌。 仅当 `status` 为 `authorized` 时通过。 |

### 收到的生物测量信息

自**v7.2**

生物测量设置已收到。

| 现场                             | 类型       | 说明                      |
| ------------------------------ | -------- | ----------------------- |
| 可用                             | 布尔       | 显示是否提供生物测量。             |
| 访问请求                           | 布尔       | 显示是否已申请使用生物识别技术的权限。     |
| 准许访问                           | 布尔       | 显示是否已批准使用生物识别技术。        |
| device_id | 字符串      | 唯一的设备标识符，可用于将令牌与设备进行匹配。 |
| 已保存令牌                          | 布尔       | 显示本地安全存储是否包含以前保存的令牌。    |
| 类型                             | 脸 "或 "手指 | 设备上当前可用的生物识别技术类型。       |

### 生物测量令牌更新

自**v7.2**

生物计量令牌已更新。

| 现场 | 类型        | 说明    |
| -- | --------- | ----- |
| 地位 | 更新 "或 "删除 | 更新状态。 |

### 接收到的\`剪贴板文本

自**v6.4**

Telegram 应用程序试图从剪贴板提取文本。

| 现场                          | 类型        | 说明                                                                                                                                                                                                              |
| --------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| req_id | 字符串       | 在调用 [web_app_read_text_from_clipboard](methods.md#web-app-read-text-from-clipboard) 方法时传递的 `req_id` 值。 |
| 数据                          | 字符串 "或 "空 | _可选_。 从剪贴板中提取的数据。 只有在应用程序可以访问剪贴板的情况下，返回值才会是 `string` 类型。                                                                                                                                                        |

### 自定义调用方法

自**v6.9**

自定义方法调用完成。

| 现场                          | 类型  | 说明              |
| --------------------------- | --- | --------------- |
| req_id | 字符串 | 本次调用的唯一标识符。     |
| 结果                          | 未知  | _可选_。 方法调用成功。   |
| 错误                          | 字符串 | _可选_。 方法调用错误代码。 |

### 关闭发票

发票已结清。

<table>
  <thead>

  <tr>
    <th>现场</th>
    <th>类型</th>
    <th>说明</th>
  </tr>

  </thead>
  <tbody>

  <tr>
    <td>小毛虫</td>
    <td>
      <code>字符串</code>
   </td>
    <td>
      在&nbsp;
      期间传递       <a href="./methods#web-app-open-invoice">
        <code>web_app_open_invoice</code>
      </a>&nbsp;
      方法调用的<code>slug</code>值。
    </td>
  </tr>

  <tr>
    <td>地位</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      发票状态。 价值：      
<ul>
        <li>
          <code>已支付</code>，发票已支付
        </li>
        <li>
          <code>失败</code>，发票失败
        </li>
        <li>
          <code>待定</code>，发票目前待定
        </li>
        <li>
          已<code>取消</code>，发票已取消
        </li>
      </ul>
    </td>
  </tr>

  </tbody>
</table>

### 主按钮被按下

用户点击了 [主按钮]（main-button.md）。

### 电话请求

自**v6.9**

申请已收到电话访问请求状态。

| 现场 | 类型  | 说明             |
| -- | --- | -------------- |
| 地位 | 字符串 | 请求状态。 只能 "发送"。 |

### 弹出窗口关闭

[Popup](popup.md) 已关闭。

| 现场                             | 类型  | 说明                                         |
| ------------------------------ | --- | ------------------------------------------ |
| button_id | 字符串 | _可选_。 被点击按钮的标识符。 如果弹出窗口关闭时没有点击任何按钮，则省略此属性。 |

### `reload_iframe`

父 iframe 请求重新加载当前 iframe。

### 接收到的`qr_text_received`文本

自**v6.4**

QR 扫描仪扫描一些 QR 并提取其内容。

| 现场 | 类型  | 说明                 |
| -- | --- | ------------------ |
| 数据 | 字符串 | _可选_。 从 QR 中提取的数据。 |

### Scan_qr_popup_closed

自**v6.4**

QR 扫描仪已关闭。

### 按下\`辅助按钮

自**v7.10**

用户点击了辅助按钮。

### 设置自定义风格

通常由 Telegram 网络应用程序发送的事件。 其有效载荷代表 `<style/>`
标记 HTML 内容，开发人员可以使用。 有效载荷中描述的样式表将帮助
开发人员设计应用程序滚动条的样式（但开发人员仍可自行设计）。

### 设置按钮已按下

自**v6.1**

按下 [设置按钮](setings-button.md) 时出现。

### 主题已更改

每当用户的 Telegram 应用程序（
，包括切换到夜间模式）中的[主题]（theming.md）发生更改时都会出现这种情况。

| 现场   | 类型                                            | 说明                                     |
| ---- | --------------------------------------------- | -------------------------------------- |
| 主题参数 | 记录<string, string>\` | 映射，其中键是主题样式表键，值是以 `#RRGGBB` 格式表示的相应颜色。 |

### 视口已更改

当 [viewport]（viewport.md）发生更改时出现。 例如，当
用户开始拖动应用程序或调用扩展方法时。

| 现场                               | 类型 | 说明                   |
| -------------------------------- | -- | -------------------- |
| 高度                               | 数字 | 视口高度。                |
| 宽度                               | 数字 | _可选_。 视口宽度。          |
| is_expanded | 布尔 | 当前视口是否已展开。           |
| 状态稳定                             | 布尔 | 视口当前状态是否稳定，下一秒是否会改变。 |

:::tip
请注意，这种方法的发送速率不足以平滑调整
应用程序窗口的大小。 您可能应该使用一个稳定的高度来代替当前的高度，或者用其他方法来处理
这个问题。
:::

### 已请求写入访问权限

自**v6.9**

应用程序收到的写入访问请求状态。

| 现场 | 类型  | 说明             |
| -- | --- | -------------- |
| 地位 | 字符串 | 请求状态。 只能 "允许"。 |
