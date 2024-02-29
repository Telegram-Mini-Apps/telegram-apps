---
outline: [2, 3]
---

# Navigation

This section of SDK covers functionality related to navigation on the Telegram Mini Apps platform.

## About navigation

Navigation in mobile applications has a rather complex nature. We use the term 'mobile' here
because, at the moment, Mini Apps are designed to resemble mobile applications, so the navigation
should follow suit.

Since Mini Apps are web applications meant to emulate mobile interfaces, it's essential to compare
browser and mobile navigation mechanisms. It's safe to say that they don't have much in common.

In simple terms, browser navigation operates over a two-linked list of history entries. Developers
can navigate through each node using forward or back navigation methods. It's also possible to
replace the current entry and add new entries, removing all those placed after the current one.

On the contrary, mobile navigation allows developers to use a multi-navigation context, implying the
existence of several navigation contexts across the application.

However, browser navigation comes with rather strict restrictions that make it challenging to
comfortably mimic the behavior seen in mobile applications within Telegram Mini Apps. This is why
this package was implemented.

## `HashNavigator`

`HashNavigator` is a class that implements a navigator working with the browser's History API. This
navigator extends the standard one, which provides basic navigation functionality, but it also
applies logic specific to the browser's history.

Creating an instance of `HashNavigator` and using its methods doesn't automatically update the
browser history. To achieve this, developers should [attach](#attaching) it. Until then, the
navigator will only update its internal state and notify all its subscribers about changes. Manual
attachment is necessary to prevent situations where several navigators of this type are created, and
each tries to control the browser history with its internal state.

This navigator employs some hacks related to the browser history, resulting in all its navigation
methods (`push`, `replace`, `go`, etc.) returning promises that will be resolved when the browser
completes the navigation. Internally, these methods update the browser's history to provide
the correct native navigation UI to a user.

::: info
In most cases, these methods don't take much time to complete. As a general observation, it takes
about 10ms for the browser to finish navigation.
:::

### Instantiating

To create an instance of this class, developers can use the class constructor, which accepts
navigation entries, a cursor (index) pointing to the entry in the entries list, and additional
options:

```typescript
import { HashNavigator } from '@tma.js/sdk';

const navigator = new HashNavigator(
  [{
    pathname: '/index',
    search: '?a=123',
    hash: '#somehash'
  }],
  0,
  { debug: true },
);
```

::: warning
If an empty entries list or a cursor pointing to a non-existent entry is passed, the constructor
will throw an appropriate error.
:::

Developers are also allowed to use static `fromLocation` method. This method
creates a navigator instance with only one entry, which will be constructed from the
`window.location.hash`:

```typescript
import { HashNavigator } from '@tma.js/sdk';

const navigator = HashNavigator.fromLocation();
```

### Attaching

To allow navigator to control the browser's history, it is required to attach via `attach`
method:

```typescript
import { HashNavigator } from '@tma.js/sdk';

const navigator = new HashNavigator(...);

navigator.attach().then(() => {
  console.log('Attachment completed');
});
```

This method returns a promise that will be resolved when the attachment is completed.

To stop navigator from modifying the browser's history, use `detach` method:

```typescript
navigator.detach();
```

### Navigating

The navigator provides a list of methods for developers to manipulate the navigation history.

#### `go`

This method moves the entries cursor by the specified delta. It returns a promise that will be
resolved when the navigation is completed.

```typescript
// Go back in history by 1 entry.
navigator.go(-1).then(() => {
  console.log('Navigation completed');
});
```

#### `back`

This method is the shorthand for `go(-1)`:

```typescript
navigator.back().then(() => {
  console.log('Navigation completed');
});
```

#### `forward`

This method is the shorthand for `go(1)`:

```typescript
navigator.forward().then(() => {
  console.log('Navigation completed');
});
```

#### `push`

To add a new navigation entry, use the `push` method. This method allows passing a new path,
described either by a string or an object with optional properties `pathname`, `search`, and `hash`.

Pushing a new navigation entry causes the navigator to replace all entries starting from the next
one relative to the current cursor with the new one. In other words, it functions similarly to the
browser's History API.

In the upcoming examples, let's assume that the current entry is `/home/blog`.

##### Absolute pathname

Specifying an absolute path will not merge it with the current one; instead, it will be used in its
entirety:

```typescript
navigator.push('/database');
// or
navigator.push({ pathname: '/database' });
// Navigator will add new entry, and current one becomes /database
```

##### Relative pathname

Specifying a relative pathname will exhibit the same behavior as in the browser:

```typescript
navigator.push('license');
// or
navigator.push({ pathname: 'license' });
// Navigator will add new entry, and current one becomes /home/license
```

##### Search

To add an entry with query parameters, use question mark (`?`) or `search` entry property:

```typescript
navigator.push('?id=1');
// or
navigator.push({ search: '?id=1' });
// Navigator will add new entry, and current one becomes /home/blog?id=1
```

::: info
Pushing a new pathname with different or missing query parameters will result in the loss of current
query parameters. To prevent this, the developer should pass them again.
:::

##### Hash

Adding the hash part of the entry follows the same logic as [search](#search), but using a
hashtag (`#`) and the `hash` entry property.

```typescript
navigator.push('#introduction');
// or
navigator.push({ hash: '#introduction' });
// Navigator will add new entry, and current one becomes /home/blog#introduction
```

#### `replace`

The `replace` method functions similarly to the [push](#push) method, but it doesn't create a new
entry. Instead, it replaces the current one.

### Properties

<p></p>

#### `pathname`

Current entry pathname.

```typescript
const navigator = new HashNavigator([{ pathname: '/index' }], 0);
navigator.pathname; // '/index'
```

#### `search`

Current entry query parameters.

```typescript
const navigator = new HashNavigator([{ search: '?id=177' }], 0);
navigator.search; // '?id=177'
```

#### `hash`

Current entry hash.

```typescript
const navigator = new HashNavigator([{ hash: '#intro' }], 0);
navigator.hash; // '#intro'
```

#### `path`

Current entry path. It concatenates [pathname](#pathname), [search](#search) and [hash](#hash).

```typescript
const navigator = new HashNavigator(
  [{
    pathname: '/index',
    search: '?a=123',
    hash: '#somehash'
  }],
  0,
);
navigator.path; // '/index?a=123#somehash'
```

#### `cursor`

Current entry cursor in entries list.

```typescript
const navigator = new HashNavigator([
  { pathname: '/' },
  { pathname: '/blog' },
], 0);
navigator.cursor; // 0
navigator.forward();
navigator.cursor; // 1
```

#### `canGoBack`

True if navigator can go back in navigation history.

```typescript
const navigator = new HashNavigator([{ pathname: '/' }], 0);
navigator.canGoBack; // false

navigator.push('/blog');
navigator.canGoBack; // true
```

#### `canGoForward`

True if navigator can go forward in navigation history.

```typescript
const navigator = new HashNavigator([{ pathname: '/' }], 0);
navigator.canGoForward; // false

navigator.push('/blog');
navigator.back();
navigator.canGoForward; // true
```

## Example

Here is the example how developer could instantiate the stable instance of `HashNavigator`.

```typescript
import { 
  HashNavigator,
  type HashNavigatorOptions,
} from '@tma.js/sdk';
import { retrieveLaunchData } from '@tma.js/launch-params';

function createNavigator() {
  let navigator: HashNavigator | undefined;
  const navigatorOptions: HashNavigatorOptions = {
    debug: true,
  };

  // If page was reloaded, we assume that navigator had to 
  // previously save its state in the session storage.
  if (retrieveLaunchData().isPageReload) {
    const stateRaw = sessionStorage.getItem('hash-navigator-state');
    if (stateRaw) {
      try {
        const { cursor, entries } = JSON.parse(stateRaw);
        navigator = new HashNavigator(
          entries,
          cursor,
          navigatorOptions,
        );
      } catch (e) {
        console.error('Unable to restore hash navigator state.', e);
      }
    }
  }

  // In case, we could not restore its state, or it is the fresh 
  // start, we can create empty navigator.
  if (!navigator) {
    navigator = new HashNavigator([{}], 0, navigatorOptions);
  }

  const saveState = (nav: HashNavigator) => {
    sessionStorage.setItem('hash-navigator-state', JSON.stringify({
      cursor: nav.cursor,
      entries: nav.getEntries(),
    }));
  }

  // Whenever navigator changes its state, we save it in 
  // the session storage.
  navigator.on('change', ({ navigator: nav }) => saveState(nav));

  // Save initial state to make sure nothing will break when page will 
  // be reloaded.
  saveState(navigator);

  return navigator;
}
```
