---
outline:
  - 2
  - 3
---

# 启动数据

负责执行 Telegram Mini
Apps [init data](../../../../.platform/init-data.md) 的组件。

## 初始化

要初始化组件，请使用 `initInitData` 函数：

```typescript
import { initInitData } from '@telegram-apps/sdk';

const initData = initInitData()；
```

## 属性

### 验证日期

类型日期

初始数据生成日期。

### canSendAfter

类型：数字", _可选项_

通过
方法 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 发送信息的秒数。

### canSendAfterDate\`（可在日期后发送

类型：日期"，_可选_

允许调用
[answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 方法的日期。

### 聊天

类型：[Chat\`](../init-data/chat.md), _optional_

包含通过附件菜单启动机器人的聊天数据的对象。
返回超级群组、频道和群组聊天 - 仅适用于通过附件
菜单启动的迷你应用程序。

### 聊天类型

类型：'发件人'|'私人'|'群组'|'超级群组'|'频道'|字符串'，_optional_

打开 Mini App 的聊天类型。

### 聊天实例

类型：字符串", _optional_

全局标识符，表示打开 Mini App 的聊天窗口。 仅返回通过直接链接打开的
申请表。

### 哈希

类型：字符串

所有传入参数的哈希值，机器人服务器可以用它来检查
它们的[有效性](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)。

### 查询 ID

类型：字符串", _optional_

Mini App 会话的唯一标识符，通过 [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) 方法发送
消息时需要使用。

### 接收器

类型：[用户](.../init-data/user.md), _optional_

一个对象，包含当前用户在聊天中的聊天伙伴数据，机器人是通过附件菜单
启动的。 仅对私人聊天和通过附件菜单启动的迷你应用程序
返回。

### 开始参数

类型：字符串", _optional_

通过链接传递的 `startattach` 参数的值。 只有通过链接从附件菜单启动
Mini Apps 时才会返回。

### 用户

类型：[用户](.../init-data/user.md), _optional_

包含当前用户数据的对象。
