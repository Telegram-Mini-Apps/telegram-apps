# Privacy

## `requestPhoneAccess`

To request access to a user's phone information, use the `requestPhoneAccess` method. If the user
grants access, the developer's bot will receive the phone details.

::: code-group

```ts [Using isAvailable]
import { requestPhoneAccess } from '@telegram-apps/sdk';

if (requestPhoneAccess.isAvailable()) {
  const status = await requestPhoneAccess();
  // status will be 'sent' | 'cancelled' | string
}
```

```ts [Using ifAvailable]
import { requestPhoneAccess } from '@telegram-apps/sdk';

const result = requestPhoneAccess.ifAvailable();
if (result[0]) {
  // status will be 'sent' | 'cancelled' | string | undefined
  const status = await result[1];
}
```

:::

## `requestWriteAccess`

To request permission to send messages to the user, use the `requestWriteAccess` method.

::: code-group

```ts [Using isAvailable]
import { requestWriteAccess } from '@telegram-apps/sdk';

if (requestWriteAccess.isAvailable()) {
  const status = await requestWriteAccess();
  // status will be 'allowed' | string
}
```

```ts [Using ifAvailable]
import { requestWriteAccess } from '@telegram-apps/sdk';

const result = requestWriteAccess.ifAvailable();
if (result[0]) {
  // status will be 'allowed' | string | undefined
  const status = await result[1];
}
```

:::

## `requestContact`

To retrieve a user's contact information, use the `requestContact` method.

::: code-group

```ts [Using isAvailable]
import { requestContact } from '@telegram-apps/sdk';

if (requestContact.isAvailable()) {
  const contact = await requestContact();
  // {
  //   contact: {
  //     user_id: 1,
  //     phone_number: '+987654321',
  //     first_name: 'Vladislav',
  //     last_name: 'Kibenko'
  //   },
  //   auth_date: Date(12345678),
  //   hash: 'abcdefgh'
  // };
}
```

```ts [Using ifAvailable]
import { requestContact } from '@telegram-apps/sdk';

const result = requestContact.ifAvailable();
if (result[0]) {
  const contact = await result[1];
  // {
  //   contact: {
  //     userId: 1,
  //     phoneNumber: '+987654321',
  //     firstName: 'Vladislav',
  //     lastName: 'Kibenko'
  //   },
  //   authDate: Date(12345678),
  //   hash: 'abcdefgh'
  // };
}
```

:::

## `requestContactComplete`

This function works the same as [requestContactComplete](#requestContactComplete), but it also returns a raw
representation of the contact data from the Telegram client, so its signature could be verified.

::: code-group

```ts [Using isAvailable]
import { requestContactComplete } from '@telegram-apps/sdk';

if (requestContactComplete.isAvailable()) {
  const contact = await requestContactComplete();
  // {
  //   raw: 'contact=...&auth_date=...&hash=...',
  //   contact: { ... }
  // }
}
```

```ts [Using ifAvailable]
import { requestContact } from '@telegram-apps/sdk';

const result = requestContact.ifAvailable();
if (result[0]) {
  const contact = await result[1];
  // {
  //   raw: 'contact=...&auth_date=...&hash=...',
  //   contact: { ... }
  // }
}
```

:::