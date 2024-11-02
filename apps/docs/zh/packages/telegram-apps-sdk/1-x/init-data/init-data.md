# `InitData`

### `authDate`

类型：`Date`

初始数据生成日期。

### `canSendAfter`

类型：`number`, _可选_

通过
方法 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 发送信息的秒数

### `chat`

类型：[`Chat`](chat.md), _可选_

包含通过
附件菜单启动机器人的聊天数据的对象。 返回超级群组、频道和群组
聊天 - 仅适用于通过附件菜单启动的迷你应用程序。

### `chatType`

类型：`'sender' | 'private' | 'group' | 'supergroup' | 'channel' | string`, _可选_

打开 Mini App 的聊天类型。

### `chatInstance`

类型：`string`, _可选_

一个全局标识符，表明迷你应用是从
打开的聊天。 仅返回通过直接链接打开的申请表。

### `hash`

类型：`string`

所有传入参数的哈希值，机器人服务器可以用它来检查
它们的[有效性](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)。

### `queryId`

类型：`string`, _可选_

Mini App 会话的唯一标识符，通过 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 方法发送
消息时需要使用。

### `receiver`

类型：[`User`](user.md), _可选_

一个对象，包含当前用户在
聊天时的聊天伙伴数据，机器人是通过附件菜单启动的。
仅对私人聊天和通过附件菜单启动的迷你应用程序
返回。

### `startParam`

类型：`string`, _可选_

通过链接传递的 `startattach` 参数的值。 只有通过链接从附件菜单启动
Mini Apps 时才会返回。

### `user`

类型：[`User`](user.md), _可选_

包含当前用户数据的对象。
