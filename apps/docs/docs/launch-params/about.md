---
sidebar_position: 1
---

# Common information

The launch parameters are the list of parameters that is passed
by the native Telegram application to the TWA application. It helps the
developer to find out the characteristics of the Telegram application, the
current device, get basic information about the user and much more.

## Transmission method

It's easy to guess, but in a web environment, one of the simplest and most
instantaneous ways to transfer data in a local environment is to specify them in
the address bar of the application. Thus, both the called server and the
downloaded application will have some pre-known data. Actually, Telegram Web
Apps technology uses the same algorithm.

The native Telegram application transmits a list of these parameters in the
dynamic part of the URL (in the hash, `#`). Accordingly, in order to access
these
parameters, it is necessary to access the `window.location.hash` property from
the JavaScript code.

## Extraction

It is important to remember that `hash` is a string property, while
Telegram transmits a whole list of properties, after which the question arises
about formatting and processing this list. In fact, everything is quite simple.

The native Telegram application passes the list of launch parameters as
query-parameters and saves the resulting string in `window.location.hash`.
For this reason, in order to extract the launch parameters, it is enough
to perform the following operation:

```typescript title="Example on how to extract launch parameters"
const hash = window.location.hash.slice(1);
console.log(hash); // tgWebAppData=...&tgWebAppVersion=6.2&...

const params = new URLSearchParams(hash);
console.log(params.get('tgWebAppVersion')); // "6.2"
```

## Parameters list

This section provides a list of parameters sent by the native application
Telegram to the TWA application.

### `tgWebAppVersion`

The current Telegram Web Apps version used by the native application. This
parameter is important to use, for example, before calling the
TWA [methods](../apps-communication/methods.mdx) to make sure, they are
supported.

### `tgWebAppData`

Init data. Contains data describing the current user, data sign, and also
some useful values. To learn more, visit the separate [section](init-data.mdx).

This parameter is passed as query parameters, so in order to get a more
user-friendly value, a developer need to use the `URLSearchParams` constructor:

```typescript title="Example of a processed value"
const initData = new URLSearchParams(params.get('tgWebAppData'));

// query_id: 'abcdef'
// user: `{id: 1, first_name: "Peris", last_name: "Hilton", username: "peris", language_code: "en", is_premium: true}`
// auth_date: '1669670292'
// hash: '4975e881a0347264512f6047e1f3d698cbd2fe0bc1573'
```

### `tgWebAppPlatform`

[Telegram application identifier](../supported-applications.md). It can be used
as a factor determining the visual style of the application, for example, when,
depending on the device, the developer needs to display components that are
different visually.

### `tgWebAppThemeParams`

Parameters of the native Telegram application [theme](../ui/theme-params.mdx).
This parameter can be used to style the application even at the moment
of rendering the loader.

The value of this parameter is a JSON object attached to the string. To
get a more user-friendly value, it is enough to use
the `JSON.parse` method.

```typescript title="Example of a processed value"
const theme = {
  bg_color: '#212121',
  text_color: '#ffffff',
  hint_color: '#aaaaaa',
  link_color: '#8774e1',
  button_color: '#8774e1',
  button_text_color: '#ffffff',
  secondary_bg_color: '#0f0f0f',
};
```

:::tip

Theme parameters can also be obtained via
a separate [method](../apps-communication/methods.mdx#web_app_request_theme).

:::
