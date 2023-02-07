---
sidebar_position: 1
---

# Structure

The Web App should have a URL to be used by Telegram. It will be used as the
source of WebView, which will load application.

Nevertheless, it is not enough for the application to work correctly. In
previous documentation sections, we also said, that some methods or events work
only starting from some Web Apps versions. But how do we determine the current
version? This is why launch parameters were created.

Launch parameters are the list of options, passed to Web App via its location.
To be more accurate,`window` location. A list of these properties will be passed
to `hash` section and will have a form of query parameters. So, you could get
them
converted to a string by calling `window.location.hash.slice(1)`.

```typescript
const params = window.location.hash.slice(1);
console.log(params); // tgWebAppData=...&tgWebAppVersion=6.2&...
```

To work with them in a more appropriate way, we use already implemented class
`URLSearchParams`:

```typescript
const params = new URLSearchParams(window.location.hash.slice(1));
console.log(params.get('tgWebAppVersion')); // "6.2"
```

## Parameters

### `tgWebAppVersion`

Contains information about the current Web App version. This parameter is useful
to check if some Web Apps [methods](../apps-communication/methods.mdx) are
supported.

### `tgWebAppData`

Web
App [init data](init-data/about).
The value of this parameter is query parameters presented as string. To make its
usage easier, consider `URLSearchParams` class.

```typescript title="Parsed value example"
const initData = {
  query_id: 'abcdef',
  user: `{id: 279058397, first_name: "Vladislav", last_name: "Kibenko", username: "vdkfrost", language_code: "en", is_premium: true}`,
  auth_date: '1669670292',
  hash: '4975e881a0347264512f6047e1f3d698cbd2fe0bc1573',
};
```

### `tgWebAppPlatform`

The [platform](../platforms) identifier.

### `tgWebAppThemeParams`

The Telegram application [theme](../features/theme) information. You could use
this parameter to know colors at the moment of Web App rendering. Keep in mind,
that you are able to receive a theme with
the [method](../apps-communication/methods.mdx#web_app_request_theme).

The value of this parameter is a JSON object converted to a string. To receive
more appropriate and easy-to-use value, use `JSON.parse` function.

```typescript title="Parsed value example"
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
