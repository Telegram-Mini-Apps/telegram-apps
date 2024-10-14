---
outline:
  - 2
  - 3
---

# 方法

Telegram 迷你应用程序方法是事件，可执行某些预定义的操作。 它们总是被迷你应用程序称为
。

## 网络

由于 Telegram 的网页版是在 "<iframe/>"标签中显示前端应用程序，因此
使用两个 iframe 之间的默认通信方式--通过 "window.parent.postMessage "函数发送信息
。

第一个参数是一个 JSON 对象，**转换为字符串**。 该对象应
具有此接口：

```typescript
interface MessageJSON {
  eventType: string;
  eventData: any;
}
```

第二个参数是 `targetOrigin` - 允许的父 iframe 起源。 我们建议在不安全的情况下避免使用通配符 `*`* 您的应用程序可能不是被
  Telegram 插入，而是被另一个 iframe 插入，而后者仍能与您的应用程序通信并接收
  的一些数据。

作为默认值，您可以使用 `https://web.telegram.org`。

因此，正如你所看到的，每个方法都有自己的名称，由 `eventType` 表示，参数存储在
的 `eventData` 属性中。 下面是使用示例：

```typescript
const data = JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: {
    is_visible: true,
  },
});

window.parent.postMessage(data, 'https://web.telegram.org')；
```

这段代码将使 Telegram [返回按钮]（back-button.md）出现。

## 桌面和移动

与网络不同，桌面和移动应用程序使用的方法调用方式更为特殊。
都将创建一个全局函数 `window.TelegramWebviewProxy.postEvent` 。

作为第一个参数，该函数接受事件名称。 第二个是参数对象，
转换为字符串。 具体操作如下：

```typescript
const data = JSON.stringify({ is_visible: true });

window
  .TelegramWebviewProxy
  .postEvent('web_app_setup_back_button', data)；
```

## Windows Phone

Telegram Windows Phone 应用程序提供 "window.external.notify "功能。 它接受与网络版相同的
参数：

```typescript
const data = JSON.stringify({
  eventType: 'web_app_setup_back_button',
  eventData: { is_visible: true },
});

window.external.notify(data)；
```

## 调用方法

为开发人员的应用程序处理所有可能的环境是一项挑战。 为了简化
这一过程，社区开发了 [@telegram-apps/sdk](../packages/telegram-apps-sdk/2-x)
软件包，大大简化了集成工作。

下面介绍如何使用它：

```ts
import { postEvent } from '@telegram-apps/sdk';

postEvent('web_app_set_header_color', { color_key: 'bg_color' })；
```

有关调用方法的更多信息，请参阅
软件包的 [documentation](../packages/telegram-apps-bridge/events.md#calling-methods) 。

## 可用方法

本节列出了可调用的可用方法及其名称、说明和
参数。 如果迷你应用程序不满足最低方法版本要求，
。 只要内部没有定义
，本地应用程序就不知道应该调用哪个方法。

### \`iframe_ready

通知父 iframe 当前帧已准备就绪。 此方法仅在 Telegram 的网络版
中使用。 因此，Mini App 将收到 [set_custom_style](events.md#set-custom-style)
事件。

| 现场   | 类型 | 说明                              |
| ---- | -- | ------------------------------- |
| 支持重载 | 布尔 | _可选_。 如果当前迷你应用程序支持本地重载，则为 True。 |

### iframe_will_reload

通知父 iframe 当前 iframe 将重新加载。

### 获取信息

自**v7.2**

请求当前的生物测量设置。

### web_app_biometry_open_settings

自**v7.2**

打开机器人的生物识别访问设置。 在需要请求生物识别
访问尚未授权的用户时非常有用。

::: info

该方法只能在用户与迷你
App 界面交互（如点击迷你 App 内部或主按钮）时调用

:::

### `web_app_biometry_request_access` `web_app_biometry_request_access`.

自**v7.2**

请求允许使用生物识别技术。

| 现场 | 类型  | 说明                                                 |
| -- | --- | -------------------------------------------------- |
| 理由 | 字符串 | _可选_。 在弹出窗口中显示给用户的文字，说明机器人需要访问生物识别信息的原因，0-128 个字符。 |

### web_app_biometry_request_auth

自**v7.2**

使用生物识别技术验证用户身份。

| 现场 | 类型  | 说明                                                             |
| -- | --- | -------------------------------------------------------------- |
| 理由 | 字符串 | _可选_。 在弹出窗口中显示给用户的文字，说明要求用户进行身份验证的原因，以及根据身份验证将采取的操作，0-128 个字符。 |

### 网络应用生物测量更新令牌

自**v7.2**

更新设备安全存储中的生物识别令牌。 要删除标记，请输入一个空的
字符串。

| 现场  | 类型  | 说明                      |
| --- | --- | ----------------------- |
| 象征性 | 字符串 | 要存储的令牌。 最大长度为 1024 个符号。 |

### 网络应用关闭

关闭迷你应用程序。

### web_app_close_scan_qr_popup

自**v6.4**

关闭 QR 扫描仪。 Telegram 应用程序会创建
[scan_qr_popup_closed](events.md#scan-qr-popup-closed) 事件。

### 网络应用数据发送

向机器人发送数据。 调用该方法时，会向机器人发送一条服务消息，其中包含
长度不超过 4096 字节的数据。 然后，迷你应用程序将关闭。

要获取更多信息，请查看
class [Message](https://core.telegram.org/bots/api#message) 中的 `web_app_data` 字段。

| 现场 | 类型  | 说明                          |
| -- | --- | --------------------------- |
| 数据 | 字符串 | 要发送给机器人的数据。 大小不应超过 4096 字节。 |

### 网络应用扩展

[展开]（viewport.md）迷你应用程序。

### `web_app_invoke_custom_method` 方法

自**v6.9**

| 现场                          | 类型  | 说明                |
| --------------------------- | --- | ----------------- |
| req_id | 字符串 | 当前调用的唯一标识符。       |
| 方法                          | 字符串 | 方法名称。             |
| 参数                          | 未知  | 根据 `method`设置的参数。 |

### web_app_open_invoice

自**v6.1**

按指定的标签打开发票。 有关发票的更多信息，请参阅
此 [文档](https://core.telegram.org/bots/payments)。

| 现场  | 类型  | 说明       |
| --- | --- | -------- |
| 小毛虫 | 字符串 | 发票唯一标识符。 |

### 网络应用打开链接

在默认浏览器中打开链接。 迷你应用程序不会关闭。

| 现场                                                         | 类型  | 说明                                                                      | 自      |
| ---------------------------------------------------------- | --- | ----------------------------------------------------------------------- | ------ |
| 网址                                                         | 字符串 | Telegram 应用程序要打开的 URL。 应是采用 `https` 协议的完整路径。                            |        |
| try_instant_view | 布尔  | _可选_。 如果可能，链接将以 [Instant View](https://instantview.telegram.org/) 模式打开。 | `v6.4` |

### web_app_open_popup

自**v6.2**

打开一个新的 [弹出窗口]（popup.md）。 当用户关闭弹出窗口时，Telegram 会创建
[popup_closed](events.md#popup-closed) 事件。

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
    <td>标题</td>
    <td>
      <code>字符串</code>
    </td>
    <td>弹出标题中要显示的文本，0-64 个字符</td>
  </tr>

  <tr>
    <td>信息</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      弹出窗口正文中要显示的信息，1-256 个字符
    </td>
  </tr>

  <tr>
    <td>按钮</td>
    <td>
      <a href="#popupbutton">
        <code>弹出按钮</code>
      </a>
    </td>
    <td>弹出窗口中要显示的按钮列表，1-3 个按钮</td>
  </tr>

  </tbody>
</table>

#### 弹出按钮

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
    <td>本我</td>
    <td>
      <code>字符串</code>
    </td>
    <td>按钮的标识符，0-64 个字符。</td>
  </tr>

  <tr>
    <td>类型</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      按钮类型。 价值：      
<ul>
        <li>
          <code>默认情况</code>下，使用默认样式的按钮
        </li>
        <li>
          <code>破坏性</code>，表示破坏性操作的按钮样式（如
          "删除"、"删除 "等）
        </li>
        <li>
          <code>ok</code>，一个带有本地化文本 "OK "的按钮
        </li>
        <li>
          <code>关闭</code>，一个带有本地化文本 "关闭 "的按钮
        </li>
        <li>
          <code>取消</code>，一个带有本地化文本 "取消 "的按钮
        </li>
      </ul>
    </td>
  </tr>

  <tr>
    <td>文本</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      按钮上要显示的文本，0-64
      字符。 当<code>键入</code> <code>确定</code>、<code>关闭</code>或
      <code>取消</code>时<i>忽略</i>。
    </td>
  </tr>
  </tbody>
</table>

### web_app_open_scan_qr_popup

自**v6.4**

打开 QR 扫描仪。 扫描仪关闭时，Telegram 应用程序会创建
[scan_qr_popup_closed](events.md#scan-qr-popup-closed) 事件。 当扫描仪读取 QR 时，
Telegram 会创建 [qr_text_received](events.md#qr-text-received) 事件。

| 现场 | 类型  | 说明                   |
| -- | --- | -------------------- |
| 文本 | 字符串 | _可选_。 QR 扫描仪中要显示的文本。 |

### `web_app_open_tg_link`

自**v6.1**

通过路径名和查询参数打开 Telegram 链接。 链接将在
Telegram 应用程序中打开，迷你应用程序将关闭。

| 现场                             | 类型  | 说明                                                     |
| ------------------------------ | --- | ------------------------------------------------------ |
| path_full | 字符串 | 应是从以下格式的链接中提取的值：`https://t.me/{path_full}`。 可额外包含查询参数。 |

### 从剪贴板读取文本

自**v6.4**

从剪贴板读取文本。 该方法接受一个请求标识符，该标识符用于
适当检索
[clipboard_text_received](events.md#clipboard-text-received) 事件中的方法执行结果。

| 现场                          | 类型  | 说明                               |
| --------------------------- | --- | -------------------------------- |
| req_id | 字符串 | 唯一的请求标识符。 应为任何唯一字符串，以便适当处理生成的事件。 |

### 网络应用就绪

通知 Telegram 当前应用程序已准备好显示。 此方法可让 Telegram
删除应用程序加载器并显示迷你应用程序。

### 网络应用请求电话

自**v6.9**

[//]: # "TODO: 检查是否正确。 它可能会请求其他用户的电话。"

请求访问当前用户的电话。

### 网络应用请求主题

请求 Telegram 当前的 [主题](theming.md)。 因此，Telegram 将
创建 [theme_changed](events.md#theme-changed) 事件。

### 网络应用请求视口

从 Telegram 请求当前 [viewport](viewport.md)信息。 因此，
Telegram 将创建 [viewport_changed](events.md#viewport-changed) 事件。

### web_app_request_write_access

自**v6.9**

请求对当前用户进行写信息访问。

### 网络应用设置背景色

自**v6.1**

更新迷你应用程序的 [背景色]（theming.md#background-and-header-colors）。

| 现场 | 类型  | 说明                                                                                                                                 |
| -- | --- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 颜色 | 字符串 | Mini App 的背景颜色（格式为 `#RRGGBB`），或其中一个值：bg_color`或 `secondary_bg_color |

### web_app_set_bottom_bar_color

自**v7.10**

更新迷你应用程序底部栏的背景颜色。

| 现场 | 类型  | 说明                                                                                                                                                                                                                       |
| -- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 颜色 | 字符串 | Mini App 底栏背景颜色（`#RRGGBB` 格式），或其中一个值：bg_color"、"secondary_bg_color "或 "bottom_bar_bg_color |

### 网络应用设置页眉颜色

自**v6.1**

更新迷你应用程序[页眉颜色]（theming.md#background-and-header-colors）。
方法应接受 `color_key` 或 `color` 属性。

| 现场                             | 类型  | 说明                                                | 自      |
| ------------------------------ | --- | ------------------------------------------------- | ------ |
| color_key | 字符串 | 迷你应用标题颜色键。 可以是 `bg_color` 或 `secondary_bg_color`。 |        |
| 颜色                             | 字符串 | RGB 格式的颜色。                                        | `v6.9` |

### `web_app_setup_back_button` 返回按钮

自**v6.1**

更新 [返回按钮](back-button.md) 设置。

| 现场                              | 类型 | 说明          |
| ------------------------------- | -- | ----------- |
| is_visible | 布尔 | 后退按钮是否应该可见？ |

### 网络应用程序设置关闭行为

更新当前的 [关闭行为]（closing-behavior.md）。

| 现场   | 类型 | 说明                  |
| ---- | -- | ------------------- |
| 需要确认 | 布尔 | 如果应用程序即将关闭，是否会提示用户？ |

### web_app_setup_main_button

更新 [主按钮](main-button.md) 设置。

| 现场                                                            | 类型  | 说明                                                | 自      |
| ------------------------------------------------------------- | --- | ------------------------------------------------- | ------ |
| is_visible                               | 布尔  | _可选_。 是否应显示按钮。                                    |        |
| is_active                                | 布尔  | _可选_。 是否应启用该按钮。                                   |        |
| is_progress_visible | 布尔  | _可选_。 是否应显示按钮内的加载器。 如果某些操作需要时间，请使用此属性。 该加载器将通知用户。 |        |
| 文本                                                            | 字符串 | _可选_。 按钮内的文本。                                     |        |
| 颜色                                                            | 字符串 | _可选_。 按钮背景颜色，格式为 `#RRGGBB`。                       |        |
| 文字颜色                                                          | 字符串 | _可选_。 按钮文本颜色，格式为 `#RRGGBB`。                       |        |
| 具有阳光效应                                                        | 布尔  | _可选_。 按钮是否应该有闪亮的效果？                               | `v7.8` |

### 设置按钮

自**v6.10**

更新 [设置按钮] 的当前状态（settings-button.md）。

| 现场                              | 类型 | 说明            |
| ------------------------------- | -- | ------------- |
| is_visible | 布尔 | 是否显示 "设置 "按钮。 |

### web_app_setup_swipe_behavior 行为

自**v7.7**

设置新的轻扫行为。

| 现场     | 类型 | 说明              |
| ------ | -- | --------------- |
| 允许垂直擦拭 | 布尔 | 允许使用垂直轻扫关闭应用程序。 |

### 网络应用分享故事

自**v7.8**

打开本地故事编辑器的方法。

| 现场                                                    | 类型  | 说明                                                                                                           |
| ----------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------ |
| 媒体URL                                                 | 字符串 | 媒体 URL，将用作创建故事的背景。                                                                                           |
| 文本                                                    | 字符串 | _可选_。 要添加到媒体中的标题。 普通用户为 0-200 个字符，[高级用户](https://telegram.org/faq_premium#telegram-premium) 为 0-2048 个字符。    |
| widget_link                      | 对象  | _可选_。 描述要包含在故事中的 widget 链接的对象。 请注意，只有 [高级用户](https://telegram.org/faq_premium#telegram-premium) 才能发布带有链接的故事。 |
| widget_link.url  | 字符串 | 故事中要包含的 URL。                                                                                                 |
| widget_link.name | 字符串 | _可选_。 小部件链接显示的名称，0-48 个字符。                                                                                   |

### web_app_setup_secondary_button

自**v7.10**

更新辅助按钮设置的方法。

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
    <td>is_visible</td>
    <td>
      <code>布尔</code>
    </td>
    <td><i>可选</i>。 是否应显示按钮。</td>
  </tr>

  <tr>
    <td>is_active</td>
    <td>
      <code>布尔</code>
    </td>
    <td><i>可选</i>。 是否应启用该按钮。</td>
  </tr>

  <tr>
    <td>is_progress_visible</td>
    <td>
      <code>布尔</code>
    </td>
    <td>
      <i>可选</i>。 是否应显示按钮内的加载器。 如果 
      某些操作需要时间，请使用此属性。 该加载器将通知用户。
    </td>
  </tr>

  <tr>
    <td>颜色</td>
    <td>
      <code>字符串</code>
    </td>
    <td><i>可选</i>。 按钮背景颜色，格式为<code>#RRGGBB</code>。</td>
  </tr>

  <tr>
    <td>文字颜色</td>
    <td>
      <code>字符串</code>
    </td>
    <td><i>可选</i>。 按钮文本颜色，格式为<code>#RRGGBB</code>。</td>
  </tr>

  <tr>
    <td>具有阳光效应</td>
    <td>
      <code>布尔</code>
    </td>
    <td><i>可选</i>。 按钮是否应该有闪亮的效果？</td>
  </tr>

  <tr>
    <td>位置</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      <i>可选</i>。 辅助按钮的位置。 只有在主按钮和 
      副按钮都可见时才适用。 <br/>支持的值：      
<ul>
        <li>
          <code>左侧</code>，显示在主按钮左侧， 
        </li>
        <li>
          <code>右侧</code>，显示在主按钮右侧，
        </li>
        <li>
          <code>顶部</code>，显示在主按钮上方，
        </li>
        <li>
          <code>底部</code>，显示在主按钮下方。
        </li>
      </ul>
    </td>
  </tr>
  </tbody>
</table>

### web_app_switch_inline_query

自**v6.7**

在当前聊天的输入框中插入机器人的用户名和指定的内联查询。
查询可能为空，在这种情况下，只会插入机器人的用户名。 客户端会提示
用户选择特定聊天，然后打开该聊天，在输入框中插入机器人的用户名和
指定的内联查询。

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
    <td>询问</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      在当前机器人名称之后插入的文本。 最大长度为 
      <b>256 个</b>符号。
    </td>
  </tr>

  <tr>
    <td>聊天类型</td>
    <td>
      <code>字符串[]</code>
    </td>
    <td>
      可用于发送信息的聊天类型列表。 可能是空列表。 价值：      
<ul>
        <li>
          <code>用户</code> 
        </li>
        <li>
          <code>机器人</code>
        </li>
        <li>
          <code>组别</code>
        </li>
        <li>
          <code>频道</code>
        </li>
      </ul>
    </td>
  </tr>

  </tbody>
</table>

### 网络应用触发触觉反馈

自**v6.1**

生成 [触觉反馈]（haptic-feedback.md）事件。

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
    <td>类型</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      触觉事件类型。 价值：      
<ul>
        <li>
          当 UI 组件发生碰撞时会产生<code>影响</code>。
        </li>
        <li>
          当某些操作执行完毕时<code>发出通知</code>。
        </li>
        <li>
          <code>selection_change</code>，当用户更改选择时。
        </li>
      </ul>
    </td>
  </tr>

  <tr>
    <td>impact_style</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      <code>类型</code>为<code>impact</code> 时必须填写。 价值：      
<ul>
        <li>
          <code>光</code>，表示小型或轻量级用户界面对象之间发生碰撞
        </li>
        <li>
          <code>中型</code>，表示中等大小或中等重量的 UI
          物体之间发生碰撞
        </li>
        <li>
          <code>重</code>，表示大型或重量级用户界面对象之间发生碰撞
        </li>
        <li>
          <code>刚性</code>，表示硬质或不灵活的用户界面对象之间发生碰撞
        </li>
        <li>
          <code>软</code>，表示软性或柔性 UI 对象之间发生碰撞
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>通知类型</td>
    <td>
      <code>字符串</code>
    </td>
    <td>
      <code>类型</code>为<code>通知</code>时必须填写。 价值：      
<ul>
        <li>
          <code>错误</code>，表示任务或操作失败
        </li>
        <li>
          <code>success</code> 表示任务或操作已成功完成
        </li>
        <li>
          <code>警告</code>，表示某项任务或操作产生了警告
        </li>
      </ul>
    </td>
  </tr>
  </tbody>
</table>
