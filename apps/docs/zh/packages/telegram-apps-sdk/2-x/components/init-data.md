---
outline:
  - 2
  - 3
---

# 初始数据

负责 Telegram Mini
Apps [init data](../../../../.platform/init-data.md) 的💠[组件](../scopes.md)。

## 恢复

要恢复组件状态，请使用 `restore` 方法。

::: code-group

```ts [Variable]
import { initData } from '@telegram-apps/sdk';

initData.restore()；
```

```ts [Functions]
import { restoreInitData } from '@telegram-apps/sdk';

restoreInitData()；
```

:::

## 解析

要将值解析为初始数据，请使用 `parseInitData` 函数。

```ts
import { parseInitData } from '@telegram-apps/sdk';

const initData = parseInitData();
// {
// user：{
// id: 99281932,
// firstName：Andrew',
// lastName：Rogue',
// username: 'rogue',
// languageCode：'en',
// isPremium: true,
// allowsWriteToPm: true,
// },
// hash：'abcedef123',
// authDate：Date(1716922846000),
// startParam: 'debug',
// chatType：'sender',
// chatInstance: '8428209589180549439',
// }；
```

该函数返回[init data](../../../.../.../platform/init-data.md#parameters-list)对象
，其中包含深驼峰型属性。

## 信号

本节提供了与启动数据有关的信号的完整列表。

### 验证日期

返回类型：日期 | 未定义

初始化数据的创建日期。

::: code-group

```ts [Variable]
initData.authDate(); // Date(1727368894000)
```

```ts [Functions]
import { initDataAuthDate } from '@telegram-apps/sdk';

initDataAuthDate(); // Date(1727368894000)
```

:::

### canSendAfter

返回类型：数字 | 未定义

通过
方法 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 发送信息的秒数。

::: code-group

```ts [Variable]
initData.canSendAfter(); // 3600
```

```ts [Functions]
import { initDataCanSendAfter } from '@telegram-apps/sdk';

initDataAuthDate(); // 3600
```

:::

### canSendAfterDate\`（可在日期后发送

返回类型：日期 | 未定义

[canSendAfter]（#cansendafter），但作为日期。

::: code-group

```ts [Variable]
initData.canSendAfterDate(); // Date(1727368897600)
```

```ts [Functions]
import { initDataCanSendAfterDate } from '@telegram-apps/sdk';

initDataCanSendAfterDate(); // Date(1727368897600)
```

:::

### 聊天

返回类型：未定义 "或[`Chat`](.../.../.../.../platform/init-data.md#chat)，带驼峰形
属性。

包含通过附件菜单启动机器人的聊天数据的对象。

> [！注意]
> 返回超级群组、频道和群组聊天记录 - 仅适用于通过
> 附件菜单启动的迷你应用程序。

::: code-group

```ts [Variable]
initData.chat();
// {
// id: 7728725378876215,
// type: 'group',
// title: '@BotFather',
// photoUrl: 'https://example.com/image.png',
// username: 'botfather'
// }
```

```ts [Functions]
import { initDataChat } from '@telegram-apps/sdk';

initDataChat();
// {
// id: 7728725378876215,
// type: 'group',
// title: '@BotFather',
// photoUrl: 'https://example.com/image.png',
// username: 'botfather'
// }
```

:::

### 聊天类型

返回类型：字符串 | 未定义

打开迷你应用程序的聊天类型。 价值：

- 发件人
- 私人
- 组
- 超级组
- 频道

> [！注]
> 仅返回通过直接链接打开的申请。

::: code-group

```ts [Variable]
initData.chatType(); // "群组
```

```ts [Functions]
import { initDataChatType } from '@telegram-apps/sdk';

initDataChatType(); // 'group'.
```

:::

### 聊天实例

返回类型：字符串 | 未定义

全局标识符，表示打开迷你应用的聊天窗口。

> [! WARNING]
> 仅返回通过直接链接打开的应用程序。

::: code-group

```ts [Variable]
initData.chatInstance(); // "群组
```

```ts [Functions]
import { initDataChatInstance } from '@telegram-apps/sdk';

initDataChatInstance(); // '899667289674387257'.
```

:::

### 哈希

返回类型：字符串 | 未定义

初始化数据签名。

::: code-group

```ts [Variable]
initData.hash(); // "组
```

```ts [Functions]
import { initDataHash } from '@telegram-apps/sdk';

initDataHash(); // 'sgbbc62g3bvdhg3djsaasd'.
```

:::

### 查询 ID

返回类型：字符串 | 未定义

迷你应用程序的唯一会话 ID。 在
通过
方法 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 发送信息的过程中使用。

::: code-group

```ts [Variable]
initData.queryId(); // "组
```

```ts [Functions]
import { initDataQueryId } from '@telegram-apps/sdk';

initDataQueryId(); // 'ssVXZ231ger'.
```

:::

### 生

返回类型：字符串 | 未定义

初始化数据的原始字符串。

::: code-group

```ts [Variable]
initData.raw(); // 'user=...&chat=...&..
```

```ts [Functions]
import { initDataRaw } from '@telegram-apps/sdk';

initDataRaw(); // 'user=...&chat=...&....'
```

:::

### 接收器

返回类型：未定义 "或[`User`](.../.../.../.../platform/init-data.md#user)，带驼峰形
属性。

一个对象，包含当前用户在
聊天时的聊天伙伴数据，机器人是通过附件菜单启动的。

> [！注意]
> 仅对私人聊天和通过附件菜单启动的迷你应用程序返回。

::: code-group

```ts [Variable]
initData.user();
// {
// addedToAttachmentMenu: false,
// allowsWriteToPm: true,
// isPremium: true,
// firstName：'Pavel',
// id: 78262681,
// isBot: false,
// lastName：'Durov',
// languageCode：'ru',
// photoUrl: 'https://example.com/image.png',
// username: 'durove',
// }
```

```ts [Functions]
import { initDataUser } from '@telegram-apps/sdk';

initDataUser();
// {
// addedToAttachmentMenu: false,
// allowsWriteToPm: true,
// isPremium: true,
// firstName：'Pavel',
// id: 78262681,
// isBot: false,
// lastName：'Durov',
// languageCode：'ru',
// photoUrl: 'https://example.com/image.png',
// username: 'durove',
// }
```

:::

### 状态

返回类型：未定义 "或[`InitData`](.../.../.../.../platform/init-data.md#parameters-list)，带有
深驼峰型属性。

包含对象格式初始化数据的对象。

::: code-group

```ts [Variable]
initData.state()；
```

```ts [Functions]
import { initDataState } from '@telegram-apps/sdk';

initDataState()；
```

:::

### 开始参数

返回类型：字符串 | 未定义

链接中指定的 `startattach` 或 `startapp` 查询参数的值。

::: code-group

```ts [Variable]
initData.startParam(); // "我的值
```

```ts [Functions]
import { initDataStartParam } from '@telegram-apps/sdk';

initDataStartParam(); // 'my-value'.
```

:::

### 用户

返回类型：未定义 "或[`User`](.../.../.../.../platform/init-data.md#user)，带驼峰形
属性。

包含当前用户信息的对象。

::: code-group

```ts [Variable]
initData.user();
// {
// addedToAttachmentMenu: false,
// allowsWriteToPm: true,
// isPremium: true,
// firstName：'Pavel',
// id: 78262681,
// isBot: false,
// lastName：'Durov',
// languageCode：'ru',
// photoUrl: 'https://example.com/image.png',
// username: 'durove',
// }
```

```ts [Functions]
import { initDataUser } from '@telegram-apps/sdk';

initDataUser();
// {
// addedToAttachmentMenu: false,
// allowsWriteToPm: true,
// isPremium: true,
// firstName：'Pavel',
// id: 78262681,
// isBot: false,
// lastName：'Durov',
// languageCode：'ru',
// photoUrl: 'https://example.com/image.png',
// username: 'durove',
// }
```

:::
