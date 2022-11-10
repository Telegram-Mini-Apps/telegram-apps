# twa-bridge <sup><img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" alt="ts" width="20"/></sup>

[npm-badge]: https://img.shields.io/npm/v/twa-bridge?logo=npm

[npm-link]: https://npmjs.com/package/twa-bridge

[size-badge]: https://img.shields.io/bundlephobia/minzip/twa-bridge

[![NPM][npm-badge]][npm-link]
![Size][size-badge]

Package which provides utilities to simplify communication flow between
frontend and Telegram native applications. It also solves some across-platform
data difference problems to protect developers code and save their time.

## Installation

```bash 
npm i twa-bridge
```

or

```bash  
yarn add twa-bridge
```

## Usage

### Initializing

`Bridge` component has rather simple API. Its main purpose is to provide
communication layer between Telegram native and client applications, so you
could call native methods and receive events from Telegram application.

To start using bridge, it is enough to use `init` method:

```typescript
import {init} from 'twa-bridge';

const bridge = init();
```

This function will append special handler to global window object, which is
used by Telegram native application. It is allowed to use it as many times
as required as long as this function will just reuse once created event emitter
and event receiving function.

### Debug mode

`Bridge` supports debug mode which outputs additional log messages into console.
By default, this mode is disabled. To enable it, it is required to pass
`debug: true` while creating new `Bridge` instance.

```typescript
import {init} from 'twa-bridge';

const bridge = init({debug: true});
```

Or, in case when instance already exists, just change its `debug` property
to `true`.

```typescript
import {init} from 'twa-bridge';

const bridge = init();
bridge.debug = true;
```

As a result, you will see logs in console with information about called
methods and processes.

### Posting events

To call Web Apps methods, it is enough to call `Bridge`s `postEvent` method.
This method automatically finds correct way of sending event which depends
on current environment. Let's take a look on simple example:

```typescript
import {init} from 'twa-bridge';

const bridge = init();

// Close current application.
bridge.postEvent('web_app_close')
```

Some events don't require parameters, and they can be called without additional
second parameter which represents event payload. But there are some events,
which have arguments:

```typescript
import {init} from 'twa-bridge';

const bridge = init();

// Open new popup.
bridge.postEvent('web_app_open_popup', {
  title: 'Web Apps Notification',
  message: 'I love Web Apps',
  buttons: [{type: 'ok', id: 'ok'}]
});
```

### Tracking events

Tracking of events is rather simple thing too. For this purpose, we could
use such methods as `on` and `subscribe`. To remove event listeners, we
use `off` and `unsubscribe`:

```typescript
import {Bridge, BridgeEventListener} from 'twa-bridge';
import {GlobalListener} from 'twa-core';

const bridge = new Bridge();
const listener: BridgeEventListener<'viewport_changed'> = payload => {
  console.log('Viewport changed:', payload)
};
const globalListener: GlobalListener = (event, ...args) => {
  console.log('Event was called:', event, ...args);
};

// Add event listener.
bridge.on('viewport_changed', listener);

// Add any event listener.
bridge.subscribe(globalListener);

// Remove event listeners.
bridge.off('viewport_changed', listener);
bridge.unsubscribe(globalListener);
```

### Lower level control

Previously, we used such function as `init` almost without any parameters,
but this method supports some more additional options.

#### `defineReceiver: boolean`

By default, `init` sets this value as `true`. It leads to call of function
named `defineEventReceiver` which defines global function, handling events
from native application and emitting window `message` event.

It is safe to use this function as many times as required. This function
will run only once.

In spite of it is not recommended, you could set this option to `false`.
This will lead to not handling of events in iOS, Android and desktop
versions of Telegram, unless some additional actions are done.

#### `emitter: GlobalEventEmitter`

Bridge itself is not listening to window `message` event or events sent
from Telegram native application directly. It expects passing event emitter
that is responsible for this kind of job.

This way of working with events allows us to normally subscribe to and
unsubscribe from such events.

In case, this property is not passed, function will create required event
emitter, place it in window for future reuse by other `Bridge` instances,
and store it in newly created bridge.

## Higher-level control

As long as bridge provides only low-level control, we recommend using
[SDK](https://github.com/Telegram-Web-Apps/sdk), which implements
bridge methods. It also provides additional parameters checks, more intuitive
method names and easier usage.
