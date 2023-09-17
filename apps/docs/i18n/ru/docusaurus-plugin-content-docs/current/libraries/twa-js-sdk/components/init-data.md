# `InitData`

[user-ref]: https://github.com/Telegram-Web-Apps/twa/blob/master/packages/init-data/src/types.ts#L5
[chat-ref]: https://github.com/Telegram-Web-Apps/twa/blob/master/packages/init-data/src/types.ts#L55

Компонент, ответственный за отображение данных инициализации приложения. Более подробно про данные инициализации можно прочитать в [документации](../../../launch-params/init-data.mdx).

## Usage

Этот класс представляет собой объект со свойствами, доступными только для чтения. Для создания его экземпляра разработчик может использовать конструктор:

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

Дата создания данных инициализации.

### `canSendAfter: Date | null`

Дата, после которой сообщение может быть отправлено через метод [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

### <code>chat: [Chat][chat-ref] | null</code>

Объект, который содержит данные о чате с ботом. 

Возвращается для супергрупп, каналов и групповых чатов. Только для приложений, запущенных из меню вложений.

### `hash: string`

Хеш всех переданных параметров, который может быть использован сервером разработчика для [проверки их валидности](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).

### `queryId: string | null`

Уникальный идентификатор текущей сессии. Необходим в рамках отправки сообщений через метод [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery).

### <code>receiver: [User][user-ref] | null</code>

Объект, который содержит данные о собеседнике текущего пользователя. 

Возвращается только для приватных чатов и только для приложений, запущенных из меню вложений.

### `raw: string`

Сырое представление данных инициализации. Обычно представляет собой объект JSON, приведенный к строке.

### `startParam: string | null`

Значение параметра `startattach` содержащегося в [ссылке](https://core.telegram.org/bots/webapps#adding-bots-to-the-attachment-menu).

Возвращается только для приложений, запущенных из меню вложений.

### <code>user: [User][user-ref] | null</code>

Объект, содержащий информацию о текущем пользователе.