# 初始化

正如
`@telegram-apps/bridge` [documentation](../../telegram-apps-bridge/events.md#define-event-handlers) 中所述，必须手动定义
事件处理程序，才能开始监听 Telegram 迷你应用程序事件。

此外，在我们的代码中，我们希望确保在调用某个方法时，该方法要么有效，要么我们
会收到该方法无效的通知。 为此，有必要了解当前使用的 Telegram
Mini Apps 版本。

为满足这些要求，软件包提供了 `init` 函数，该函数接受具有以下结构的对象
：

```ts
interface Options {
  /**
   * 如果 SDK 应接受从 Telegram
   * 应用程序发送的样式，则为 true。
   * @default true
   */
  acceptCustomStyles?: boolean;
  /**
   * 最大支持的 Mini Apps 版本。
   * @default 使用 `retrieveLaunchParams`
   * 函数提取。
   * @see retrieveLaunchParams
   */
  version?Version;
  /**
   * 自定义 postEvent 函数。
   *
   * 传递 "strict "值将创建一个函数，该函数始终
   * 检查当前 Mini
   * Apps 版本是否支持指定的调用。如果方法不受支持，
   * 将抛出错误。
   *
   * 传递 "non-strict "值可创建一个 postEvent 函数
   *，该函数不会抛出错误，但会就缺少方法
   * 支持发出警告。
   *
   * @default 'strict'
   * @see createPostEvent
   */
  postEvent?: PostEventFn | 'strict' | 'non-strict';
}
```

在大多数情况下，开发人员不需要使用这些选项。

调用该函数后，将配置软件包的全局依赖关系，并创建 Telegram
Mini Apps 事件处理程序。

```ts
import { init } from '@telegram-apps/sdk';

init()；
```
