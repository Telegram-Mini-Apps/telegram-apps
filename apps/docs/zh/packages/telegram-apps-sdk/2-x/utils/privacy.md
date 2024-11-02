# 隐私

## `requestPhoneAccess`

要请求访问用户的电话信息，请使用 `requestPhoneAccess` 方法。 如果用户
授予访问权限，开发者的机器人就会收到手机详细信息。

```ts
import { requestPhoneAccess } from '@telegram-apps/sdk';

if (requestPhoneAccess.isSupported()) {
  const status = await requestPhoneAccess();
  // status will be 'sent' | 'cancelled' | string
}
```

## `requestWriteAccess`

要请求向用户发送消息的权限，请使用 `requestWriteAccess` 方法。

```ts [Functions]
import { requestWriteAccess } from '@telegram-apps/sdk';

if (requestWriteAccess.isSupported()) {
  const status = await requestWriteAccess();
  // status will be 'allowed' | string
}
```


## `requestContact`

要检索用户的联系信息，请使用 `requestContact` 方法。

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