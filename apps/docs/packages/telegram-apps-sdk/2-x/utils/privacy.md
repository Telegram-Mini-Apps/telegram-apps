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

const status = await requestPhoneAccess.ifAvailable();
// status will be 'sent' | 'cancelled' | string | undefined
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

const status = await requestWriteAccess.ifAvailable();
// status will be 'allowed' | string | undefined
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

```ts [Using ifAvailable]
import { requestContact } from '@telegram-apps/sdk';

const contact = await requestContact.ifAvailable();
// {
//   contact: {
//     userId: 1,
//     phoneNumber: '+987654321',
//     firstName: 'Vladislav',
//     lastName: 'Kibenko'
//   },
//   authDate: Date(12345678),
//   hash: 'abcdefgh'
// } | undefined;
```

:::




