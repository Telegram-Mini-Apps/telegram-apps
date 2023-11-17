---
outline: [2, 3]
---

# `InitData`

The component which is responsible for displaying the Telegram Mini
Apps [init data](../../../../platform/launch-parameters/init-data.md). This class represents object with
readonly properties. To create its new instance, a developer could use the class constructor as
follows:

```typescript
import { InitData } from '@tma.js/sdk';

const authDate = new Date();
const hash = 'myhash';
const initData = new InitData(authDate, hash, {
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

The third constructor parameter is optional and represents the object with optional properties.

## Properties

### `authDate`

Type: `Date`

Init data generation date.

### `canSendAfter`

Type: `Date | null`

Date after which a message can be sent via
the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### `chat`

Type: <code>[Chat](../../tma-js-init-data/chat.md) | null</code>

An object containing data about the chat where the bot was launched via
the attachment menu. Returned for supergroups, channels and group
chats – only for Mini Apps launched via the attachment menu.

### `chatType`

Type: `'sender' | 'private' | 'group' | 'supergroup' | 'channel' | string | null`

The type of chat from which Mini App was opened.

### `chatInstance`

Type: `string | null`

A global identifier indicating the chat from which Mini App was
opened. Returned only for applications opened by direct link.

### `hash`

Type: `string`

A hash of all passed parameters, which the bot server can use to check
their [validity](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).

### `queryId`

Type: `string | null`

A unique identifier for the Mini App session, required for sending
messages via the [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery) method.

### `receiver`

Type: <code>[User](../../tma-js-init-data/user.md) | null</code>

An object containing data about the chat partner of the current user in
the chat where the bot was launched via the attachment menu.
Returned only for private chats and only for Mini Apps launched
via the attachment menu.

### `startParam`

Type: `string | null`

The value of the `startattach` parameter, passed via link. Only returned for
Mini Apps when launched from the attachment menu via link.

### `user`

Type: <code>[User](../../tma-js-init-data/user.md) | null</code>

An object containing data about the current user.
