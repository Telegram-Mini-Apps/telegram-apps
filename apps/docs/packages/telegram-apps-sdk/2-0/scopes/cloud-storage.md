# Cloud Storage

The scope responsible for managing cloud storage in Telegram Mini Apps.

## Setting Keys

To set a key value, use the `set` method.

```ts
if (cloudStorage.set.isSupported()) {
  await cloudStorage.set('a', 'a-value');
}
```

## Getting Keys

To retrieve a list of all existing keys, use the `getKeys` method.

```ts
import { cloudStorage } from '@telegram-apps/sdk';

if (cloudStorage.getKeys.isSupported()) {
  const keys = await cloudStorage.getKeys(); // ['a', 'b', 'c']
}
```

To get the value of a specific key or multiple keys, use the `get` method.

```ts
if (cloudStorage.get.isSupported()) {
  const nonExistent = await cloudStorage.get('non-existent'); 
  // The result is an empty string: ''
  
  const existent = await cloudStorage.get('a'); 
  // The result is the value of the 'a' key. Example: 'a-value'
  
  const values = await cloudStorage.get(['a', 'b', 'non-existent']);
  // The result is a record of the keys 'a', 'b', and 'non-existent'. Example:
  // { 
  //   a: 'a-value', 
  //   b: 'b-value', 
  //   'non-existent': '', 
  // }
}
```

## Deleting Keys

To delete a key or a list of keys, use the `deleteKeys` method.

```ts
if (cloudStorage.deleteKeys.isSupported()) {
  await cloudStorage.deleteKeys('a');
  await cloudStorage.deleteKeys(['a', 'b', 'c']);
}
```
