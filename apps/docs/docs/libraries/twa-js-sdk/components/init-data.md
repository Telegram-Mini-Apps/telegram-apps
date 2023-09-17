# `InitData`

[user-ref]: https://github.com/Telegram-Web-Apps/twa/blob/master/packages/init-data/src/types.ts#L5
[chat-ref]: https://github.com/Telegram-Web-Apps/twa/blob/master/packages/init-data/src/types.ts#L55

The component which is responsible for displaying the Web Apps init data. There is more information about init data in this
[documentation](../../../launch-params/init-data.mdx).

## Usage

This class represents object with readonly properties. To create its new instance, a developer could use the class constructor as follows:

```typescript
import { InitData } from '@twa.js/sdk';

const authDate = new Date();
const hash = 'myhash';
const initData = new InitData(authDate, hash, {
  queryId: 'AAHdF6IQAAAAAN0Xoh',
  // ...
});
```

## `InitData`

### `authDate: Date`

Init data generation date.

### `canSendAfter: Date | null`

Date after which a message can be sent via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### <code>chat: [Chat][chat-ref] | null</code>

An object containing data about the chat where the bot was launched via the attachment menu. 

Returned for supergroups, channels and group chats – only for Web Apps launched via the attachment menu.

### `hash: string`

A hash of all passed parameters, which the bot server can use to [check their validity](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).

### `queryId: string | null`

A unique identifier for the Web App session, required for sending messages via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### <code>receiver: [User][user-ref] | null</code>

An object containing data about the chat partner of the current user in the chat where the bot was launched via the attachment menu. 

Returned only for private chats and only for Web Apps launched via the attachment menu.

### `raw: string`

Raw representation of parsed init data. It is usually presented as JSON object converted to string.

### `startParam: string | null`

The value of the `startattach` parameter, passed via [link](https://core.telegram.org/bots/webapps#adding-bots-to-the-attachment-menu). 

Only returned for Web Apps when launched from the attachment menu via link.

### <code>user: [User][user-ref] | null</code>

An object containing data about the current user.