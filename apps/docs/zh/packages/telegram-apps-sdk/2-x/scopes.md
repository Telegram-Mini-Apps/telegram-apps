# 作用域

此包旨在让开发者全面掌控其生命周期，包括初始化过程。因此，不提供预初始化的全局作用域；开发者必须自行配置各个作用域。

所谓*作用域*，指的是一组相关功能集合成的单一实体。例如，`backButton` 和 `mainButton` 就是作用域的示例。这样的设计使得 SDK 使用起来更加直观和高效。

需要注意的是，*作用域*以下列形式提供：

💠**组件**. 它们同时作为变量和函数集导出。
例如，开发人员可以使用导出的 `backButton` 变量或
其替代函数集：`showBackButton`、`mountBackButton` 等。

⚙️**Utilities**. 它们作为一组函数导出。 这些作用域是抽象的，并没有将
组合成一个变量。 例如，`openLink`、`shareURL` 等。

实际上，导出变量只是相同导出函数的组合。
因此，`backButton.isMounted` 和 `isBackButtonMounted` 本质上是同一个实体。

这里有一个例子：

```ts
import {
  backButton,
  hideBackButton,
  isBackButtonVisible,
} from '@telegram-apps/sdk';

isBackButtonVisible(); // false

backButton.show();
// backButton.isVisible and isBackButtonVisible are the same 
// entity (signal). We can say the same about backButton.show 
// and showBackButton.
//
// backButton.isVisible() -> true
// isBackButtonVisible() -> true

hideBackButton();
// backButton.isVisible() -> false
// isBackButtonVisible() -> false
```

这里的关键区别在于最终的捆绑尺寸。 在内部，`backButton` 输出通过以下代码进行处理：

```ts
export * as backButton from 'somewhere';
```

在构建应用程序时不使用软件包源代码时，bundler 更有可能
使 `backButton` 成为不可树状移动的对象。 因此，来自 `somewhere` 的所有依赖项都将被
捆绑，从而略微增加了最终捆绑包的大小（尽管不会增加很多）。

## 优化捆绑包

> [!TIP]
> SDK 开箱即可高效运行，因此一般无需遵循本节所述的
> 优化。 不过，如果您希望
> 在特定情况下最大限度地提高软件包的效率，这些指导原则还是很有帮助的。

让我们看看如何更有效地使用软件包：

- 只使用函数可以让捆绑程序树状分叉未使用的作用域代码。

```ts
import { showBackButton, backButton } from '@telegram-apps/sdk';

showBackButton();
// Only showBackButton's source code will be bundled.

backButton.show();
// All backButton dependencies will be bundled, even 
// if not used in the code: backButton.show(), 
// backButton.hide(), backButton.isVisible(), etc.
```

- 配置捆绑程序以使用源代码，而不是内置版本。

```ts
import { backButton } from '@telegram-apps/sdk';

backButton.show();
// Only backButton.show's source code will be bundled 
// because the bundler is smart enough to understand 
// that backButton.show is just the showBackButton 
// function, so only its source code is bundled.
```

下面是一个使用 `resolve` 选项的 Vite 配置示例：

```ts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@telegram-apps/sdk': resolve('node_modules/@telegram-apps/sdk/src'),
    },
  },
});
```
