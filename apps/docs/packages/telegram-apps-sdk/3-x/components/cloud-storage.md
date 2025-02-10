# Cloud Storage

The 💠[component](../scopes.md) responsible for managing the cloud storage in Telegram Mini Apps.

## Checking Support

To check if the cloud storage is supported by the current Telegram Mini Apps version, the
`isSupported` method is used:

::: code-group

```ts [Variable]
import { cloudStorage } from '@telegram-apps/sdk';

cloudStorage.isSupported(); // boolean
```

```ts [Functions]
import { isCloudStorageSupported } from '@telegram-apps/sdk';

isCloudStorageSupported(); // boolean
```

:::

## Setting Items

To set a key value, use the `setItem` method.

::: code-group

```ts [Variable]
if (cloudStorage.setItem.isAvailable()) {
  await cloudStorage.setItem('a', 'a-value');
}
```

```ts [Functions]
import { setCloudStorageItem } from '@telegram-apps/sdk';

if (setCloudStorageItem.isAvailable()) {
  await setCloudStorageItem('a', 'a-value');
}
```

:::

## Getting Keys

To retrieve a list of all existing keys, use the `getKeys` method.

::: code-group

```ts [Variable]
if (cloudStorage.getKeys.isAvailable()) {
  const keys = await cloudStorage.getKeys(); // ['a', 'b', 'c']
}
```

```ts [Functions]
import { getCloudStorageKeys } from '@telegram-apps/sdk';

if (getCloudStorageKeys.isAvailable()) {
  const keys = await getCloudStorageKeys(); // ['a', 'b', 'c']
}
```

:::

To get the value of a specific key or multiple keys, use the `getItem` method.

::: code-group

```ts [Variable]
if (cloudStorage.getItem.isAvailable()) {
  const nonExistent = await cloudStorage.getItem('non-existent');
  // The result is an empty string: ''

  const existent = await cloudStorage.getItem('a');
  // The result is the value of the 'a' key. Example: 'a-value'

  const values = await cloudStorage.getItem(['a', 'b', 'non-existent']);
  // The result is a record of the keys 'a', 'b', and 'non-existent'. 
  // Example:
  // { 
  //   a: 'a-value', 
  //   b: 'b-value', 
  //   'non-existent': '', 
  // }
}
```

```ts [Functions]
import { getCloudStorageItem } from '@telegram-apps/sdk';

if (getCloudStorageItem.isAvailable()) {
  const nonExistent = await getCloudStorageItem('non-existent');
  // The result is an empty string: ''

  const existent = await getCloudStorageItem('a');
  // The result is the value of the 'a' key. Example: 'a-value'

  const values = await getCloudStorageItem(['a', 'b', 'non-existent']);
  // The result is a record of the keys 'a', 'b', and 'non-existent'. 
  // Example:
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

```ts [Variable]
if (cloudStorage.deleteItem.isAvailable()) {
  await cloudStorage.deleteItem('a');
  await cloudStorage.deleteItem(['a', 'b', 'c']);
}
```

```ts [Functions]
import { deleteCloudStorageItem } from '@telegram-apps/sdk';

if (deleteCloudStorageItem.isAvailable()) {
  await deleteCloudStorageItem('a');
  await deleteCloudStorageItem(['a', 'b', 'c']);
}
```

:::
