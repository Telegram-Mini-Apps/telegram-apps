# 链接

## 打开链接

要在外部浏览器或使用 [Instant View](https://instantview.telegram.org/) 打开链接，
使用 `openLink` 方法。 您还可以传递一个可选的第二个参数，即一个带有可选
属性 `tryBrowser.OpenLinkBrowser (string)` 和 `tryInstantView: boolean` 的对象：和 `tryInstantView: boolean`。

```ts
import { openLink } from '@telegram-apps/sdk';

openLink('https://telegram.org', {
  tryBrowser：'chrome',
  tryInstantView: true,
}）；
```

## 打开电报链接

要使用预定义行为打开 Telegram 链接，请使用 `openTelegramLink` 方法。 此方法
允许您应用
[Deep Links](https://core.telegram.org/api/links) 文档中描述的本地行为。

```ts
import { openTelegramLink } from '@telegram-apps/sdk';

openTelegramLink('https://t.me/heyqbnk')；
```

## 共享 URL

要与其他用户、频道或组共享 URL，请使用 `shareURL` 方法。

```ts
import { shareURL } from '@telegram-apps/sdk';

shareURL('https://t.me/heyqbnk', 'Check out this cool group!')；
```
