---
outline: [2, 3]
---

# `InitData`

The component which is responsible for implementing the Telegram Mini
Apps [init data](../../../platform/init-data.md). This class represents
an object with properties getters. To create its new instance, a developer could use the class
constructor as follows:

```typescript
import { InitData } from '@tma.js/sdk';

const initData = new InitData({
  authDate: new Date(),
  canSendAfter: 1000,
  chat: {
    id: 7728558344,
    photoUrl: 'https://img.static.telegram.org/image',
    type: 'group',
    title: 'Telegram Developers',
    username: 'johnybravo',
  },
  chatType: 'sender',
  chatInstance: '-9982961682389',
  hash: 'myhash',
  queryId: 'AAHdF6IQAAAAAN0Xoh',
  startParam: 'customvalue',
  user: {
    addedToAttachmentMenu: false,
    allowsWriteToPm: true,
    firstName: 'Johny',
    id: 22231781,
    isBot: false,
    isPremium: true,
    lastName: 'Bravo',
    languageCode: 'en',
    photoUrl: 'https://img.static.telegram.org/johnybravo',
    username: 'johnybravo',
  },
});
```

All properties of the passed constructor object excluding `authDate` and `hash` are optional.

## Properties

### `authDate`

Type: `Date`

Init data generation date.

### `canSendAfter`

Type: `number`, _optional_

The number of seconds after which a message can be sent via the
method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

### `canSendAfterDate`

Type: `Date`, _optional_

Date after which it is allowed to call
the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### `chat`

Type: [`Chat`](../../tma-js-init-data/chat.md), _optional_

An object containing data about the chat where the bot was launched via the attachment menu.
Returned for supergroups, channels and group chats – only for Mini Apps launched via the attachment
menu.

### `chatType`

Type: `'sender' | 'private' | 'group' | 'supergroup' | 'channel' | string`, _optional_

The type of chat from which Mini App was opened.

### `chatInstance`

Type: `string`, _optional_

A global identifier indicating the chat from which Mini App was opened. Returned only for
applications opened by direct link.

### `hash`

Type: `string`

A hash of all passed parameters, which the bot server can use to check
their [validity](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).

### `queryId`

Type: `string`, _optional_

A unique identifier for the Mini App session, required for sending
messages via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### `receiver`

Type: [`User`](../../tma-js-init-data/user.md), _optional_

An object containing data about the chat partner of the current user in the chat where the bot was
launched via the attachment menu. Returned only for private chats and only for Mini Apps launched
via the attachment menu.

### `startParam`

Type: `string`, _optional_

The value of the `startattach` parameter, passed via link. Only returned for
Mini Apps when launched from the attachment menu via link.

### `user`

Type: [`User`](../../tma-js-init-data/user.md), _optional_

An object containing data about the current user.
