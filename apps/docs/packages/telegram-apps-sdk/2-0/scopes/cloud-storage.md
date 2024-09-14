# Cloud Storage

The scope responsible for managing the cloud storage in Telegram Mini Apps.

## Setting Items

To set a key value, use the `setItem` method.

::: code-group

```ts [Using object]
import { cloudStorage } from '@telegram-apps/sdk';

if (cloudStorage.setItem.isSupported()) {
  await cloudStorage.setItem('a', 'a-value');
}
```

```ts [Using functions]
import { setStorageItem } from '@telegram-apps/sdk';

if (setStorageItem.isSupported()) {
  await setStorageItem('a', 'a-value');
}
```

:::

## Getting Keys

To retrieve a list of all existing keys, use the `getKeys` method.

::: code-group

```ts [Using object]
if (cloudStorage.getKeys.isSupported()) {
  const keys = await cloudStorage.getKeys(); // ['a', 'b', 'c']
}
```

```ts [Using functions]
import { getStorageKeys } from '@telegram-apps/sdk';

if (getStorageKeys.isSupported()) {
  const keys = await getStorageKeys(); // ['a', 'b', 'c']
}
```

:::

To get the value of a specific key or multiple keys, use the `getItem` method.

::: code-group

```ts [Using object]
if (cloudStorage.get.isSupported()) {
  const nonExistent = await cloudStorage.getItem('non-existent'); 
  // The result is an empty string: ''
  
  const existent = await cloudStorage.getItem('a'); 
  // The result is the value of the 'a' key. Example: 'a-value'
  
  const values = await cloudStorage.getItem(['a', 'b', 'non-existent']);
  // The result is a record of the keys 'a', 'b', and 'non-existent'. Example:
  // { 
  //   a: 'a-value', 
  //   b: 'b-value', 
  //   'non-existent': '', 
  // }
}
```

```ts [Using functions]
import { getStorageItem } from '@telegram-apps/sdk';

if (getStorageItem.isSupported()) {
  const nonExistent = await getStorageItem('non-existent'); 
  // The result is an empty string: ''
  
  const existent = await getStorageItem('a'); 
  // The result is the value of the 'a' key. Example: 'a-value'
  
  const values = await getStorageItem(['a', 'b', 'non-existent']);
  // The result is a record of the keys 'a', 'b', and 'non-existent'. Example:
  // { 
  //   a: 'a-value', 
  //   b: 'b-value', 
  //   'non-existent': '', 
  // }
}
```

:::

## Deleting Items

To delete a key or a list of keys, use the `deleteItem` method.

::: code-group

```ts [Using object]
if (cloudStorage.deleteItem.isSupported()) {
  await cloudStorage.deleteItem('a');
  await cloudStorage.deleteItem(['a', 'b', 'c']);
}
```

```ts [Using functions]
if (deleteStorageItem.isSupported()) {
  await deleteStorageItem('a');
  await deleteStorageItem(['a', 'b', 'c']);
}
```

:::
