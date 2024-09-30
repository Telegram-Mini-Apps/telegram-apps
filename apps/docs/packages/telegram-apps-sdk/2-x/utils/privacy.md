# Privacy

## `requestPhoneAccess`

To request access to a user's phone information, use the `requestPhoneAccess` method. If the user
grants access, the developer's bot will receive the phone details.

```ts
import { requestPhoneAccess } from '@telegram-apps/sdk';

if (requestPhoneAccess.isSupported()) {
  const status = await requestPhoneAccess();
  // status will be 'sent' | 'cancelled' | string
}
```

## `requestWriteAccess`

To request permission to send messages to the user, use the `requestWriteAccess` method.

```ts [Functions]
import { requestWriteAccess } from '@telegram-apps/sdk';

if (requestWriteAccess.isSupported()) {
  const status = await requestWriteAccess();
  // status will be 'allowed' | string
}
```


## `requestContact`

To retrieve a user's contact information, use the `requestContact` method.

```ts
import { requestContact } from '@telegram-apps/sdk';

if (requestContact.isSupported()) {
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