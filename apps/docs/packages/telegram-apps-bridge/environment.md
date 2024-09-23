# Environment

This package is designed to be used only inside the Telegram application. Since non-Telegram
environments lack Telegram-specific traits, calling methods such
as [retrieveLaunchParams](launch-parameters.md) or [postEvent](methods#postevent) will lead to
errors.

Nevertheless, the package provides utilities that help developers either develop the application
outside of Telegram or determine if the current environment is not a Telegram Mini App at all.

## `isTMA`

To check if the current environment is Telegram Mini Apps, a developer can use the `isTMA` function.
It works in two modes: **simple** and **complete**.

### Simple

In this mode, the function attempts to retrieve launch parameters from the environment.

If the extraction is successful, the environment is considered Telegram Mini Apps.
Simple mode is synchronous and returns a boolean value.

```ts
import { isTMA } from '@telegram-apps/bridge';

if (isTMA('simple')) {
  console.log('It\'s Telegram Mini Apps');
}
```

This mode is somewhat superficial but may still be sufficient for most applications. For a more
reliable check, use the [complete](#complete) mode.

### Complete

In this mode, the function calls a Telegram Mini Apps-specific method and waits for a
method-specific event to occur.

```ts
import { isTMA } from '@telegram-apps/bridge';

if (await isTMA()) {
  console.log('It\'s Telegram Mini Apps');
}
```

The function waits for an event for 100 milliseconds, but a developer can change this time
by passing an object with the `timeout: number` property.

```ts
if (await isTMA({ timeout: 50 })) {
  console.log('It\'s Telegram Mini Apps');
}
```

## `mockTelegramEnv`

The package provides the `mockTelegramEnv` function, which imitates the environment provided by
Telegram. It helps developers start building applications even without creating a mini app record in
[BotFather](https://t.me/botfather).

This function accepts launch parameters in raw or parsed format. Here is an example:

```ts
mockTelegramEnv({
  themeParams: {
    accentTextColor: '#6ab2f2',
    bgColor: '#17212b',
    buttonColor: '#5288c1',
    buttonTextColor: '#ffffff',
    destructiveTextColor: '#ec3942',
    headerBgColor: '#17212b',
    hintColor: '#708499',
    linkColor: '#6ab3f3',
    secondaryBgColor: '#232e3c',
    sectionBgColor: '#17212b',
    sectionHeaderTextColor: '#6ab3f3',
    subtitleTextColor: '#708499',
    textColor: '#f5f5f5',
  },
  initData: {
    user: {
      id: 99281932,
      firstName: 'Andrew',
      lastName: 'Rogue',
      username: 'rogue',
      languageCode: 'en',
      isPremium: true,
      allowsWriteToPm: true,
    },
    hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
    authDate: new Date(1716922846000),
    startParam: 'debug',
    chatType: 'sender',
    chatInstance: '8428209589180549439',
  },
  initDataRaw: new URLSearchParams([
    ['user', JSON.stringify({
      id: 99281932,
      first_name: 'Andrew',
      last_name: 'Rogue',
      username: 'rogue',
      language_code: 'en',
      is_premium: true,
      allows_write_to_pm: true,
    })],
    ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
    ['auth_date', '1716922846'],
    ['start_param', 'debug'],
    ['chat_type', 'sender'],
    ['chat_instance', '8428209589180549439'],
  ]).toString(),
  version: '7.2',
  platform: 'tdesktop',
});
```

::: warning
Note that this function only imitates Telegram environment behavior. It doesn't send any real
requests or perform actions that will only be visible in the Telegram application.
:::
