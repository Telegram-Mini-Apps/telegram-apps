# 云存储

负责管理 Telegram 迷你应用程序中云存储的💠[组件](../scopes.md)。

## 检查支持

要检查当前 Telegram 迷你应用程序版本是否支持云存储，需要使用
`isSupported` 方法：

::: code-group

```ts [Variable]
import { cloudStorage } from '@telegram-apps/sdk';

cloudStorage.isSupported(); // boolean
```

```ts [Functions]
import { isCloudStorageSupported } from '@telegram-apps/sdk';

isCloudStorageSupported(); // 布尔型
```

:::

## 设置项目

要设置键值，请使用 `setItem` 方法。

::: code-group

```ts [Variable]
await cloudStorage.setItem('a', 'a-value')；
```

```ts [Functions]
import { setCloudStorageItem } from '@telegram-apps/sdk';

await setCloudStorageItem('a', 'a-value')；
```

:::

## 获取钥匙

要获取所有现有密钥的列表，请使用 `getKeys` 方法。

::: code-group

```ts [Variable]
const keys = await cloudStorage.getKeys(); // ['a', 'b', 'c'] ['a','b','c']。
```

```ts [Functions]
import { getCloudStorageKeys } from '@telegram-apps/sdk';

const keys = await getCloudStorageKeys(); // ['a', 'b', 'c'].
```

:::

要获取特定键或多个键的值，请使用 `getItem` 方法。

::: code-group

```ts [Variable]
const nonExistent = await cloudStorage.getItem('non-existent');
// 结果是空字符串：''

const existent = await cloudStorage.getItem('a');
// 结果是'a'键的值。示例：'a-value'

const values = await cloudStorage.getItem(['a', 'b', 'non-existent']);
// 结果是键'a'、'b'和'non-existent'的记录。 
// 示例
{ // 
// a：a-value', 
// b: 'b-value', 
// 'non-existent': '', 
// }
```

```ts [Functions]
import { getCloudStorageItem } from '@telegram-apps/sdk';

const nonExistent = await getCloudStorageItem('non-existent');
// 结果是空字符串：''

const existent = await getCloudStorageItem('a');
// 结果是'a'键的值。示例：'a-value'

const values = await getCloudStorageItem(['a', 'b', 'non-existent']);
// 结果是'a'、'b'和'non-existent'键的记录。 
// 示例
{ // 
// a：a-value', 
// b: 'b-value', 
// 'non-existent': '', 
// }
```

:::

## 删除项目

要删除一个键或键列表，请使用 `deleteItem` 方法。

::: code-group

```ts [Variable]
await cloudStorage.deleteItem('a');
await cloudStorage.deleteItem(['a', 'b', 'c'])；
```

```ts [Functions]
import { deleteCloudStorageItem } from '@telegram-apps/sdk';

await deleteCloudStorageItem('a');
await deleteCloudStorageItem(['a', 'b', 'c'])；
```

:::
