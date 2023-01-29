# Object types

The type definitions of each object used in init data.

## Init Data

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

## Chat

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

## User

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