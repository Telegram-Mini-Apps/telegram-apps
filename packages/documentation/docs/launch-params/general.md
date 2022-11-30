---
sidebar_position: 1
---

# About

Web Apps should have URL to be downloaded by Telegram. It will be used as source
for WebView, which will load application.

Nevertheless, it is not enough for application to work correctly. In previous
documentation sections we also said, that some methods or events work only
starting from some Web App version. But how do we determine current version?
This is why launch params were created.

Launch parameters are list of options, passed to Web App through its
location. To be more accurate, `window` location. List of these properties will
be passed to `hash` section and will have form of query parameters. So, you
could get them converted to string by calling `window.location.hash.slice(1)`.

```typescript
const params = window.location.hash.slice(1);
console.log(params); // tgWebAppData=...&tgWebAppVersion=6.2&...
```

To work with them in more appropriate way, we use already implemented class
`URLSearchParams`:

```typescript
const params = new URLSearchParams(window.location.hash.slice(1));
console.log(params.get('tgWebAppVersion')); // "6.2"
```

## Parameters

### `tgWebAppVersion`

Contains information about current Web App version. This parameter is useful
to check, if some [Web App method](../apps-communication/methods) supported.

### `tgWebAppData`

Web App [init data](init-data/general). Value of this parameter is query parameters
presented as string. To make its usage easier, consider `URLSearchParams` class.

```typescript title="Parsed example value"
{
  query_id: "abcdef",
  user: `{id: 279058397, first_name: "Vladislav", last_name: "Kibenko", username: "vdkfrost", language_code: "en", is_premium: true}`,
  auth_date: "1669670292",
  hash: "4975e881a0347264512f6047e1f3d698cbd2fe0bc1573",
}
```

### `tgWebAppPlatform`

[Platform](../platforms) identifier.

### `tgWebAppThemeParams`

[Theme](../features/theme) information. You could use this parameter to
know colors at the moment of Web App render. Keep in mind, that you are able to
receive theme with [method](../apps-communication/methods#web_app_request_theme)
.

Value of this parameter is JSON object converted to string. To receive more
appropriate and easy to use value, use `JSON.parse` function.

```typescript title="Parsed example value"
{
  "bg_color": "#212121",
  "text_color": "#ffffff",
  "hint_color": "#aaaaaa",
  "link_color": "#8774e1",
  "button_color": "#8774e1",
  "button_text_color": "#ffffff",
  "secondary_bg_color": "#0f0f0f"
}
```
