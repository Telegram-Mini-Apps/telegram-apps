import {
  Chat,
  InitData as TwaInitData,
  User,
} from '@twa.js/init-data';

/**
 * Class which is responsible for displaying Web Apps init data.
 */
class InitData {
  private readonly _canSendAfter: Date | null = null;
  private readonly _chat: Chat | null = null;
  private readonly _queryId: string | null = null;
  private readonly _receiver: User | null = null;
  private readonly _startParam: string | null = null;
  private readonly _user: User | null = null;

  constructor(
    private _authDate: Date,
    private _hash: string,
    options: Omit<TwaInitData, 'authDate' | 'hash'> = {},
  ) {
    const {
      chat = null, user = null, queryId = null, receiver = null,
      startParam = null, canSendAfter = null,
    } = options;
    this._canSendAfter = canSendAfter;
    this._chat = chat;
    this._user = user;
    this._queryId = queryId;
    this._receiver = receiver;
    this._startParam = startParam;
  }

  /**
   * Returns init data generation date.
   */
  get authDate(): Date {
    return this._authDate;
  }

  /**
   * Returns date after which a message can be sent via the answerWebAppQuery
   * method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get canSendAfter(): Date | null {
    return this._canSendAfter;
  }

  /**
   * Returns an object containing data about the chat where the bot was
   * launched via the attachment menu. Returned for supergroups, channels and
   * group chats – only for Web Apps launched via the attachment menu.
   */
  get chat(): Chat | null {
    return this._chat;
  }

  /**
   * Returns a hash of all passed parameters, which the bot server can use to
   * check their validity.
   * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
   */
  get hash(): string {
    return this._hash;
  }

  /**
   * Returns a unique identifier for the Web App session, required for sending
   * messages via the `answerWebAppQuery` method.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  get queryId(): string | null {
    return this._queryId;
  }

  /**
   * Returns an object containing data about the chat partner of the current
   * user in the chat where the bot was launched via the attachment menu.
   * Returned only for private chats and only for Web Apps launched
   * via the attachment menu.
   */
  get receiver(): User | null {
    return this._receiver;
  }

  /**
   * Returns the value of the `startattach` parameter, passed via link. Only
   * returned for Web Apps when launched from the attachment menu via link.
   */
  get startParam(): string | null {
    return this._startParam;
  }

  /**
   * Returns an object containing data about the current user.
   */
  get user(): User | null {
    return this._user;
  }
}

export {InitData};