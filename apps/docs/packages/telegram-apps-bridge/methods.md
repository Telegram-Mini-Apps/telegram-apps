# Methods

This article covers topics related to [apps communication](../../platform/apps-communication.md)
methods.

## Calling Methods

To call Telegram Mini Apps methods, developers should use the `postEvent` function:

```typescript
import { postEvent } from '@telegram-apps/bridge';

postEvent('web_app_setup_back_button', { is_visible: true });
```

This function automatically determines the correct way to send the event based on the current
environment. It identifies the Telegram app type and selects the appropriate flow.

### `request`

The `request` function should be used when you need to call a Telegram Mini Apps method and receive
a specific event. For example, to call
the [web_app_request_viewport](../../platform/methods.md#web-app-request-viewport) method and catch
the [viewport_changed](../../platform/events.md#viewport-changed) event for actual viewport data:

```typescript
import { request } from '@telegram-apps/bridge';

const viewport = await request(
  'web_app_request_viewport',
  'viewport_changed',
);

console.log(viewport);
// Output:
// {
//   is_state_stable: true,
//   is_expanded: false,
//   height: 320
// };
```

If the Telegram Mini Apps method accepts parameters, pass them in the `params` property of the third
argument:

```typescript
const buttonId = await request('web_app_open_popup', 'popup_closed', {
  params: {
    title: 'Caution',
    message: 'Should we delete your account?',
    buttons: [
      { id: 'yes', type: 'ok' },
      { id: 'no', type: 'cancel' },
    ],
  },
});
```

You can also track several events at the same time:

```typescript
const result = await request(
  'web_app_open_scan_qr_popup',
  ['qr_text_received', 'scan_qr_popup_closed'],
);

// The result will either be the qr_text_received 
// or scan_qr_popup_closed event payload.
```

This function allows passing additional options such as `postEvent`, `abortSignal`, `timeout`,
and `capture`.

#### `postEvent`

The `postEvent` option allows you to override the method used to call the Telegram Mini Apps method.

```typescript
request('web_app_request_viewport', 'viewport_changed', {
  postEvent() {
    console.log('Hey, I am not going to do anything');
  },
});
```

#### `abortSignal`

To abort the returned promise externally, use the `abortSignal` option.

```ts
const controller = new AbortController();

request('web_app_request_viewport', 'viewport_changed', {
  abortSignal: controller.signal,
});

setTimeout(() => {
  controller.abort(new Error('Not going to wait anymore'));
}, 500);
```

#### `timeout`

The `timeout` option assigns a timeout to the request.

```typescript
import { request } from '@telegram-apps/bridge';

try {
  await request(
    'web_app_invoke_custom_method',
    'custom_method_invoked',
    {
      timeout: 5000,
      params: {
        req_id: '1',
        method: 'deleteStorageValues',
        params: { keys: ['a'] },
      },
    },
  );
} catch (e) {
  console.error(e); // TypedError with e.type === 'ERR_TIMED_OUT'
}
```

#### `capture`

The `capture` property is a function that allows developers to determine if an occurred Mini Apps
event should be captured and returned from the `request` function:

```typescript
const slug = 'jjKSJnm1k23lodd';

request('web_app_open_invoice', 'invoice_closed', {
  params: { slug },
  capture(data) {
    return slug === data.slug;
  },
});
```

By default, the `request` function captures the first event with the required name. In this case,
the function will capture the event only if it has the expected slug.

When passing an array of events, the `capture` function will receive an object with
the `event: EventName` and `payload?: EventPayload` properties.

## Invoking Custom Methods

Custom methods can be used with
the [web_app_invoke_custom_method](../../platform/methods.md#web-app-invoke-custom-method) method.
The `invokeCustomMethod` function simplifies the usage of such methods by reusing the `request`
function.

Here’s an example without using this function:

```typescript
const reqId = 'ABC';

request('web_app_invoke_custom_method', 'custom_method_invoked', {
  params: {
    req_id: reqId,
    method: 'deleteStorageValues',
    params: { keys: ['a'] },
  },
  capture(data) {
    return data.req_id === reqId;
  }
});
```

Now, rewritten using the `invokeCustomMethod` function:

```typescript
import { invokeCustomMethod } from '@telegram-apps/bridge';

invokeCustomMethod('deleteStorageValues', { keys: ['a'] }, 'ABC');
```

Unlike the `request` function, the `invokeCustomMethod` function parses the result and checks if it
contains the `error` property. If it does, the function throws the corresponding error; otherwise,
the `result` property is returned.

## Checking Method Support

The `postEvent` function does not check if the specified method is supported by the current Telegram
app. To do this, use the `supports` function, which accepts a Mini Apps method name and the current
platform version:

```typescript
import { supports } from '@telegram-apps/bridge';

supports('web_app_trigger_haptic_feedback', '6.0'); // false
supports('web_app_trigger_haptic_feedback', '6.1'); // true
```

The `supports` function also allows checking if a specific parameter in the method parameters is
supported:

```typescript
import { supports } from '@telegram-apps/bridge';

supports('web_app_open_link', 'try_instant_view', '6.0'); // false
supports('web_app_open_link', 'try_instant_view', '6.7'); // true
```

::: tip
It is recommended to use this function before calling Mini Apps methods to prevent apps from
stalling or encountering unexpected behavior.
:::

## Creating Safer `postEvent`

This package includes a function named `createPostEvent` that takes the current Mini Apps version as
input. It returns the `postEvent` function, which internally checks if the specified method and
parameters are supported.

```typescript
import { createPostEvent } from '@telegram-apps/bridge';

const postEvent = createPostEvent('6.5');

// Will work fine.
postEvent('web_app_read_text_from_clipboard');

// Will throw an error.
postEvent('web_app_request_phone');
```

As a second optional argument, the function accepts a callback that is triggered if the method or
parameter is unsupported:

```ts
createPostEvent('6.0', (data) => {
  if ('param' in data) {
    console.warn(
      'Oops, the parameter', data.param,
      'in method', data.method,
      'is not supported',
    );
  } else {
    console.warn('Oops, method', data.method, 'is not supported');
  }
});
```

You can also specify `'non-strict'` mode to log warnings instead of throwing errors:

```ts
createPostEvent('6.0', 'non-strict');
```