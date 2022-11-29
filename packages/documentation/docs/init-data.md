---
sidebar_position: 5
---

# Init data

Init data is rather important part of Telegram's platform. In simple terms,
init data is a set of properties, which contains useful information about
current Web App launch. You could use this information to identify user
on server side. Thanks to Telegram, it provides special init data signature
[verification flow](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app)
via pseudocode.

## Object types

Here comes the type definition of each object used in init data.

### Init Data

```typescript
interface InitData {
  /**
   * Init data generation date as unix time.
   */
  auth_date: number;

  /**
   * Time in seconds, after which a message can be sent via the
   * answerWebAppQuery method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  can_send_after?: number;

  /**
   * An object containing data about the chat where the bot was launched via
   * the attachment menu. Returned for supergroups, channels and group
   * chats – only for Web Apps launched via the attachment menu.
   */
  chat?: Chat;

  /**
   * A hash of all passed parameters, which the bot server can use to
   * check their validity.
   */
  hash: string;

  /**
   * A unique identifier for the Web App session, required for sending
   * messages via the answerWebAppQuery method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  query_id?: string;

  /**
   * An object containing data about the chat partner of the current user in
   * the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Web Apps launched
   * via the attachment menu.
   */
  receiver?: User;

  /**
   * The value of the startattach parameter, passed via link. Only returned for
   * Web Apps when launched from the attachment menu via link.
   */
  start_param?: string;

  /**
   * An object containing data about the current user.
   */
  user?: User;
}
```

### Chat

```typescript
interface Chat {
  /**
   * Unique identifier for this chat.
   */
  id: number;

  /**
   * URL of the chat’s photo. The photo can be in .jpeg or .svg formats.
   * Only returned for Web Apps launched from the attachment menu.
   */
  photo_url?: string;

  /**
   * Type of chat.
   */
  type: 'group' | 'supergroup' | 'channel';

  /**
   * Title of the chat.
   */
  title: string;

  /**
   * Username of the chat.
   */
  username?: string;
}
```

### User

```typescript
interface User {
  /**
   * First name of the user or bot.
   */
  first_name: string;

  /**
   * A unique identifier for the user or bot.
   */
  id: number;

  /**
   * True, if this user is a bot. Returned in the `receiver` field only.
   */
  is_bot?: boolean;

  /**
   * True, if this user is a Telegram Premium user.
   */
  is_premium?: boolean;

  /**
   * Last name of the user or bot.
   */
  last_name?: string;

  /**
   * IETF language tag of the user's language. Returns in user field only.
   * @see https://en.wikipedia.org/wiki/IETF_language_tag
   */
  language_code?: string;

  /**
   * URL of the user’s profile photo. The photo can be in .jpeg or .svg
   * formats. Only returned for Web Apps launched from the attachment menu.
   */
  photo_url?: string;

  /**
   * Username of the user or bot.
   */
  username?: string;
}
```

## Extraction

The easiest way to pass init data to application and allow its usage while
executing javascript code is to specify it in application URL. That's why
Telegram Web Apps uses this way. As long as init data is one of the
[launch parameters](launch-params), you could extract it this way:

```typescript title="Extraction example"
// Get "tgWebAppData" launch parameter.
const param = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

// Convert it to more appropriate form.
const initData = new URLSearchParams(param);

// Get "hash" property.
console.log(initData.get('hash')); // 4975e881a0347264512f6047e1f3d698cbd2...
```

## Sending to server

One of the main features of init data is it could be used as authorization
factor. It means, you could use it to identify requesting client.

As long as init data is always signed by Telegram bot secret token (sign is
placed in `hash` property), you could always verify it and trust its properties.

The best way to pass init data to your server is to specify it in some header.
Here comes the example in JavaScript with `axios` library usage:

```typescript title="Sending init data to server"
import axios from 'axios';

const initData = new URLSearchParams(window.location.hash.slice(1)).get('tgWebAppData');

if (initData === null) {
  throw new Error('Ooof! Something is wrong. Are we in Telegram wrapper?');
}

// Create axios instance.  
const http = axios.create({
  headers: {
    // Append authorization header. 
    Authorization: `Bearer ${initData}`,
  }
});

// Now, in case we use this instance to perform requests, 
// authorization header will be automatically appended. 
// The next thing we have to do is just verify it on server side.  
```

## Libraries and examples

Not to waste your time, you could use our verification examples and libraries
via different programming languages:

- TypeScript (NodeJS and browser)
  - [Example](https://github.com/Telegram-Web-Apps/twa/blob/master/packages/init-data/src/validation.ts)
  - [Library](https://github.com/Telegram-Web-Apps/twa/tree/master/packages/init-data)
- GoLang
  - [Example](https://github.com/Telegram-Web-Apps/init-data-golang/blob/master/main.go)
  - [Library](https://github.com/Telegram-Web-Apps/init-data-golang)
