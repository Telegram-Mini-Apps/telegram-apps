# @telegram-apps/signals

<p style="display: flex; gap: 8px; min-height: 20px">
  <a href="https://npmjs.com/package/@telegram-apps/signals">
    <img src="https://img.shields.io/npm/v/@telegram-apps/signals?logo=npm"/>
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/@telegram-apps/signals"/>
  <a href="https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/signals">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

我们在整个 `@telegram-apps` 软件包中使用的信号实现。

## 安装

::: code-group

```bash [pnpm]
pnpm i @telegram-apps/signals
```

```bash [npm]
npm i @telegram-apps/signals
```

```bash [yarn]
yarn add @telegram-apps/signals
```

:::

## 信号

信号 "函数是最简单的信号构造函数，被其他软件包函数所使用。 要
创建新信号，只需传递初始值即可：

```ts
import { signal } from '@telegram-apps/signals';

const isVisible = signal(false)；
```

返回值代表一个具有实用方法的函数。 函数本身返回
当前信号值。

```ts
console.log('The element is', isVisible() ?'可见'：'不可见'）；
```

该函数还接受选项作为第二个参数。 开发人员可以指定
`equals` 函数，该函数接受当前值和输入值，如果认为它们相等，则返回 true，
。

```ts
const s = signal(10, {
  equals(current, next) {
    // 如果下一个值比当前值高，将不会更新信号。
    //
    return next > current;
  } }.
});
s.set(20); // 将不会更新信号
s.set(5); // 将更新信号
```

### 设置

要设置新值，请使用 `set` 方法：

```ts
isVisible.set(true)；
```

### `sub`

要跟踪信号变化，请使用 `sub` 方法。 它返回一个函数，用于移除绑定的
监听器。 监听器接受两个参数：当前值和上一个值。

```ts
const removeListener = isVisible.sub((current, prev) => {
  console.log('Value changed from', prev, 'to', current);
});

// 在需要时移除监听器。
removeListener()；
```

要只调用监听器一次，请使用第二个：

```ts
function listener(current: boolean, prev: boolean) {
  console.log('Value changed from', prev, 'to', current);
}

isVisible.sub(listener, true);
// or
isVisible.sub(listener, { once: true })；
```

### `unsub`

另外，要移除监听器，开发人员可以使用 `unsub` 方法：

```ts
function listener(current: boolean, prev: boolean) {
  console.log('Value changed from', prev, 'to', current);
}

isVisible.sub(listener);

// 在需要时移除监听器。
isVisible.unsub(listener)；
```

### `unsubAll`

要移除所有监听器，请使用 `unsubAll` 方法：

```ts
isVisible.unsubAll()；
```

::: info

此方法不会移除计算信号添加的监听器。

:::

### 复位

要恢复到最初指定的值，请使用 `reset` 方法：

```ts
import { signal } from '@telegram-apps/signals';

const isVisible = signal(false);
isVisible.set(true); // isVisible becomes true
isVisible.reset(); // isVisible becomes false again
```

### 销毁

当不再需要该信号且该信号没有被任何计算信号监听时，开发者
可以使用 `destroy` 方法强制移除所有监听者：

```ts
isVisible.destroy()；
```

## 计算

计算 "函数构建了一个计算信号，当被调用信号的任何
发生变化时，该信号会自动重新计算。

这里有一个例子：

```ts
import { signal, computed } from '@telegram-apps/signals';

const a = signal(2);
const b = signal(2);
const sum = computed(() => a() + b()); // 4

a.set(5); // sum becomes 7
b.set(5); // sum becomes 10
```

返回值代表一个缺少 `set` 和 `reset` 方法的信号。

## 批量更改

批处理 "函数创建一个作用域，在此对信号突变进行批处理。

当开发人员希望防止计算信号在几个
相关信号连续变化时重新计算时，该功能非常有用。

```ts
import { signal, computed, batch } from '@telegram-apps/signals';

const a = signal(1);
const b = signal(2);
const c = signal(3);
const sum = computed(() => a() + b() + c()); // 6

// 如果没有批处理，重新计算会发生 3 次：
a.set(2); // sum 重新计算后变为 7
b.set(3); // sum 重新计算后变为 8 c.set(4); // sum 重新计算后变为 9 // 重置每个信号。set(3); // sum 重新计算后变成 8
c.set(4); // sum 重新计算后变成 9

// 重置每个信号。
a.reset();
b.reset();
c.reset();
// 注意：reset 调用 set 方法，这也会导致
// sum 信号重新计算。

// 现在，让我们使用 batch 函数进行优化：
batch(() => {
  a.set(2);
  b.set(3);
  c.set(4);
});
// 此时，sum 将只重新计算一次，因为
// batch 会使 sum 信号等待函数完成，
// 然后触发重新计算。
console.log(sum()); // 9
```
