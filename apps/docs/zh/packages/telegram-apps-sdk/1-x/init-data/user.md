# `User`

### `addedToAttachmentMenu`

类型：`boolean`, _可选_

如果该用户在附件菜单中添加了机器人，则为 True。

### `allowsWriteToPm`

类型：`boolean`, _可选_

如果该用户允许机器人向其发送信息，则为 "true"。

### `firstName`

类型：`string`

用户或机器人的名字。

### `id`

类型：`number`

用户或机器人的唯一标识符。

### `isBot`

类型：`boolean`, _可选_

如果该用户是机器人，则为 True。 仅在 `receiver` 字段中返回。

### `isPremium`

类型：`boolean`, _可选_

如果该用户是 Telegram 高级用户，则为 True。

### `lastName`

类型：`string`, _可选_

用户或机器人的姓氏。

### `languageCode`

类型：`string`, _可选_

用户语言的[IETF 语言标记](https://en.wikipedia.org/wiki/IETF_language_tag)。 仅返回用户字段中的
。

### `photoUrl`

类型：`string`, _可选_

用户个人照片的 URL。 照片可以是 .jpeg 或 .svg 格式。 仅返回从附件菜单启动的 Web
应用程序。

### `username`

类型：`string`, _可选_

用户或机器人的用户名。
