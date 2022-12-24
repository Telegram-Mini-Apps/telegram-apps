---
sidebar_position: 100000
---

# Other

## Reload page

Web Apps provides a way to refresh currently opened application. This feature
is provided for user in cases, when application is seemed to be stuck. To reload
application, user should click 3 dots on top right of application
and then, use `Reload Page` option.

![img.png](../../static/docs/reload-page.png)

This item click leads to **current page** reload. As developer, you could
think of `window.location.reload()` to be called.

:::caution

In case, your application mutates `window.location.hash`, you should think of
saving Web Apps initial parameters and reusing them in case, current location
hash does not contain required data. For this purpose, you could use 
[`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

:::