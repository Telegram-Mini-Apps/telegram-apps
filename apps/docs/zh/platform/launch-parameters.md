# 发射参数

启动参数是本地 Telegram 应用程序
传递给小应用程序的参数列表。 它可以帮助开发者找出 Telegram 应用程序的特征，
当前设备，获取用户的基本信息等。

## 传输方式

在网络环境中，在本地运行的
应用程序之间传输数据最简单快捷的方法之一就是在地址栏中指定数据。 服务器可以在 URL 的哈希值中包含数据，
，使客户端应用程序可以访问这些数据。 同样，Telegram Mini App 也使用这种方法，
，Telegram 客户端环境通过 URL 的哈希值向 Mini App 发送数据。 这样，
，迷你应用程序就能在启动时访问基本信息。

Telegram 本地应用程序会在 URL
的动态部分（哈希 #）中传输这些参数的列表。 要访问这些参数，需要在 JavaScript 代码中使用 window.location.hash 属性。

## 提取

重要的是要记住，"hash "是一个字符串属性，而 Telegram 传输的是整个属性列表
，之后就会出现格式化和处理该列表的问题。 事实上，
，一切都很简单。

Telegram 本地应用程序将启动参数列表作为查询参数传递，并将
结果字符串保存在 `window.location.hash` 中。 因此，为了提取发射
参数，只需执行以下操作即可：

```typescript title="Example on how to extract launch parameters"
const hash = window.location.hash.slice(1);
console.log(hash); // tgWebAppData=...&tgWebAppVersion=6.2&...

const params = new URLSearchParams(hash);
console.log(params.get('tgWebAppVersion')); // "6.2"
```

::: tip

不过，用户可以刷新当前应用程序，而无需退出。 如果
应用程序使用哈希路由，一段时间后可能会丢失初始哈希值。 因此，
，建议在首次启动应用程序时保存这些数据。

:::

## 参数列表

### tgWebAppVersion

本地应用程序使用的当前 Telegram 迷你应用程序版本。 例如，在调用 Telegram Mini
Apps [methods](methods.md)之前，该参数是
的重要使用参数，以确保它们受支持。

### tgWebAppData

包含描述当前用户的数据、数据符号和一些有用的值。 要了解更多信息，
访问 [Init Data](init-data.md) 页面。

### tgWebAppPlatform

[Telegram 应用程序标识符](about.md#supported-applications)。 例如，当
开发人员需要根据设备显示不同视觉效果的组件时，它可以作为
因素
来决定应用程序的视觉风格。

### 主题参数

Telegram 本地应用程序 [主题] 的参数（theming.md）。 该参数
甚至在渲染加载器时也可用于设计应用程序的样式。

该参数的值是转换为字符串的 JSON 对象。 要获得更方便的
值，只需使用 `JSON.parse` 方法即可。

```typescript
const theme = {
  bg_color: '#212121',
  text_color: '#ffffffff',
  hint_color: '#aaaaaaaa',
  link_color: '#8774e1',
  button_color: '#8774e1',
  button_text_color: '#ffffffff',
  secondary_bg_color: '#0f0f0f',
}；
```

### tgWebAppShowSettings

仅 Telegram SDK 使用的参数，用于在启动时显示 "设置 "按钮。 对于外部开发人员来说，
，没有任何其他意义。

### tgWebAppBotInline

添加该参数是为了防止当前应用程序以内联模式启动。
允许调用 Telegram 迷你应用程序方法
，如 [web_app_switch_inline_query]（methods.md#web-app-switch-inline-query）。

### tgWebAppStartParam

参数，包含在机器人或应用程序
链接中传递的自定义字符串值。 [了解更多信息]（start-parameter.md）。
