# 未分类

## 从剪贴板读取文本

要从剪贴板读取文本，请使用`readTextFromClipboard`函数。

```ts
import { readTextFromClipboard } from '@telegram-apps/sdk';

if (readTextFromClipboard.isSupported()) {
  const contents = await readTextFromClipboard(); // string | null
}
```

## 分享故事

shareStory "方法会打开本地故事编辑器。

它有一个必填参数：将用作故事背景的媒体 URL。

```ts
import { shareStory } from '@telegram-apps/sdk';

if (shareStory.isSupported()) {
  shareStory('https://my.media/background.png');
}
```

该函数可选择接受一个包含附加选项的对象：

- `text?: string` - 要添加到媒体中的标题，普通
  用户的限制为 0-200 个字符，[高级用户](https://telegram.org/faq_premium#telegram-premium) 的限制为 0-2048 个字符
  。
- `widgetLink?: object` - 用于在故事中加入 widget 链接的对象。
  只有 [高级用户](https://telegram.org/faq_premium#telegram-premium) 才能发布带有链接的故事
  。
  - `url: string` - 要包含在故事中的 URL。
  - name?: string\` - widget 链接的显示名称（0-48 个字符）。

```ts
shareStory('https://my.media/background.png', {
  text: 'Today was a good day.很喜欢！感谢这个公众号！',
  widgetLink：{
    url：https://t.me/heyqbnk',
    name: 'heyqbnk public group',
  },
})；
```

## 发送数据

要向机器人发送数据，请使用 `sendData` 函数。 此功能将向
机器人发送服务消息，并关闭 Mini App。

```ts
import { sendData } from '@telegram-apps/sdk';

sendData('my-data-goes-here')；
```

> [! TIP]
> 该功能可向机器人发送多达 4096 字节的数据，适用于通过
> 键盘按钮启动的迷你应用程序。

> [！警告]
> 此功能仅适用于通过键盘按钮启动的迷你应用程序。 更多详情，请参阅
> [Message](https://core.telegram.org/bots/api#message) 类中的 `web_app_data` 字段
> 。

## 切换联机查询

要创建以机器人用户名和特定文本为前缀的消息，并在另一个
聊天工具中共享，请使用 `switchInlineQuery` 方法。 您可以使用第二个可选参数来指定可以选择哪些
聊天类型来发送信息。

```ts
import { switchInlineQuery } from '@telegram-apps/sdk';

if (switchInlineQuery.isSupported()) {
  await switchInlineQuery('Check this bot!', [
    'users',
    'bots',
    'groups',
    'channels',
  ]);
}
```
