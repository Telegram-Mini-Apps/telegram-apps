---
outline: [ 2, 3 ]
---

# @telegram-apps/sdk-svelte

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@telegram-apps/sdk-svelte">
    <img src="https://img.shields.io/npm/v/@telegram-apps/sdk-svelte?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@telegram-apps/sdk-svelte"/>
  <a href="https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/sdk-svelte">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

Svelte.js 软件包提供了开发人员在开发微型
应用程序时可能有用的实用工具。

> [!TIP]
> 由于此软件包提供了扩展 [@telegram-apps/sdk](./telegram-apps-sdk/2-x.md) 功能的实用功能，建议先查看 SDK 软件包的
> 文档。

## 安装

在继续之前，假定您已经安装了 `svelte-js` 软件包，因为它是此软件包的同级依赖关系。


::: code-group

```bash [pnpm]
pnpm i @telegram-apps/sdk-svelte
```

```bash [npm]
npm i @telegram-apps/sdk-svelte
```

```bash [yarn]
yarn add @telegram-apps/sdk-svelte
```

:::

> [!INFO]
> 此软件包完全重新导出了 [@telegram-apps/sdk](./telegram-apps-sdk/2-x) 软件包，因此 
> 您无需单独安装它。

## 用法

下面是该软件包的一个简单使用示例：

:::code-group

```svelte [index.svelte]
<script>
  import { init, backButton } from '@telegram-apps/sdk-svelte';

  import { BackButton } from './BackButton.svelte';

  // Initialize the package.
  init();
</script>

<template>
  <BackButton />
</template>
```

```svelte [BackButton.svelte]
/**
 * Component which controls the Back Button visibility.
 */
<script>
  import { onMount, onDestroy } from 'svelte';
  import { backButton, useSignal } from '@telegram-apps/sdk-svelte';

  const isVisible = useSignal(backButton.isVisible);

  $: console.log('The button is', isVisible.value ? 'visible' : 'invisible')

  onMount(() => {
    backButton.show();
  });

  onDestroy(() => {
    backButton.hide();
  });
</script>

<template></template>
```

:::

## Hooks

### `useSignal`

该辅助工具允许您在应用程序中使用我们的 [signals](./telegram-apps-signals.md)。它
返回一个 Svelte ref，每次信号发生变化时，该 ref 都会更新。

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { backButton, useSignal } from '@telegram-apps/sdk-svelte';

  const isVisible = useSignal(backButton.isVisible);

  $: console.log('The button is', isVisible.value ? 'visible' : 'invisible')

  onMount(() => {
    backButton.show();
  });

  onDestroy(() => {
    backButton.hide();
  });
</script>

<template></template>
```

### `useLaunchParams`

返回迷你应用程序启动参数的函数。

```svelte
<script>
  import { useLaunchParams } from '@telegram-apps/sdk-svelte';

  const lp = useLaunchParams();
</script>

<template>
  <div>Start param: {{ lp.startParam }}</div>
</template>
```
