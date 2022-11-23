---
sidebar_position: 3
---

# Launch parameters

As we mentioned before, Web Apps should have URL to be downloaded by Telegram.
It will be used as source for WebView, what will lead to application load.

Nevertheless, it is not enough for application to work correctly. In previous
documentation sections we also said, that some methods or events work only
starting from some Web App version. But how do we determine current version?
This is why launch params were created.

Launch parameters are list of properties, passed to Web App through its
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

Contains information about current Web App version. It is important to use it
before Web App methods calls.

### `tgWebAppData`

Web App init data. Contains mostly technical information which could be used in
some Web App methods, and information about current user, which launched
application. We explain this parameter in
separate [documentation](./init-data.md).

### `tgWebAppPlatform`

Contains platform identifier. Developer could build application UI which depends
on this value. To get full list of platforms, refer
to [this](./introduction/platforms.md) documentation.

### `tgWebAppThemeParams`

Provides information about current Telegram application theme (colors). We also
have separate [documentation](./features/theming.md) for this parameter.
