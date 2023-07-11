import type {
  Chat,
  InitData as TwaInitData,
  User,
} from '@twa.js/init-data';

/**
 * Class which is responsible for displaying Web Apps init data.
 */
export class InitData {
  readonly #authDate: Date;

  readonly #canSendAfter: Date | null = null;

  readonly #chat: Chat | null = null;

  readonly #hash: string;

  readonly #queryId: string | null = null;

  readonly #receiver: User | null = null;

  readonly #startParam: string | null = null;

  readonly #user: User | null = null;

  constructor(
    authDate: Date,
    hash: string,
    options: Omit<TwaInitData, 'authDate' | 'hash'> = {},
  ) {
    this.#authDate = authDate;
    this.#hash = hash;
    const {
      chat = null, user = null, queryId = null, receiver = null,
      startParam = null, canSendAfter = null,
    } = options;
    this.#canSendAfter = canSendAfter;
    this.#chat = chat;
    this.#user = user;
    this.#queryId = queryId;
    this.#receiver = receiver;
    this.#startParam = startParam;
  }

  /**
   * Returns init data generation date.
   */
  get authDate(): Date {
    return this.#authDate;
  }

  /**
   * Returns date after which a message can be sent via the answerWebAppQuery
   * method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get canSendAfter(): Date | null {
    return this.#canSendAfter;
  }

  /**
   * Returns an object containing data about the chat where the bot was
   * launched via the attachment menu. Returned for supergroups, channels and
   * group chats – only for Web Apps launched via the attachment menu.
   */
  get chat(): Chat | null {
    return this.#chat;
  }

  /**
   * Returns a hash of all passed parameters, which the bot server can use to
   * check their validity.
   * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
   */
  get hash(): string {
    return this.#hash;
  }

  /**
   * Returns a unique identifier for the Web App session, required for sending
   * messages via the `answerWebAppQuery` method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get queryId(): string | null {
    return this.#queryId;
  }

  /**
   * Returns an object containing data about the chat partner of the current
   * user in the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Web Apps launched
   * via the attachment menu.
   */
  get receiver(): User | null {
    return this.#receiver;
  }

  /**
   * Returns the value of the `startattach` parameter, passed via link. Only
   * returned for Web Apps when launched from the attachment menu via link.
   */
  get startParam(): string | null {
    return this.#startParam;
  }

  /**
   * Returns an object containing data about the current user.
   */
  get user(): User | null {
    return this.#user;
  }
}
