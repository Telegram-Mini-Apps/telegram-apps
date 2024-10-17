---
"@telegram-apps/sdk": minor
---

We realized that many developers might be using the SDK without knowing that some functionality they're using may not work. This is due to the non-strict `postEvent` function in the `init` function:

```ts
import { init } from "@telegram-apps/sdk";

init({
  postEvent: "non-strict",
});
```

Using the non-strict `postEvent` can lead to bugs that developers are unaware of. For example:

```ts
backButton.onClick(() => {
  // User clicked the button, navigate to a new page.
  navigate("market");
});

backButton.show();
```

In this case, if the `show` method is unsupported, and the `postEvent` function is non-strict (not throwing an error, only using `console.warn`), the user could get stuck on the current screen without any indication to the developer.

To prevent such scenarios, we now disallow non-strict `postEvent`. Only a custom `postEvent` function can be passed. This way, you can bypass the protection mechanism, but you'll be fully aware of the risks. This function can also be used to decorate the original `postEvent` from the SDK.

Since we no longer allow non-strict actions, most component and utility methods now include the `isSupported` property. For example:

```ts
import { backButton } from "@telegram-apps/sdk";

if (backButton.mount.isSupported()) {
  backButton.mount();
  backButton.show();
}
```

Calling the `mount` method without checking if it's supported may throw an error if the method is unsupported in the current Mini App version.

Additionally, if a component has the `mount` method, many of its other methods now check if the component was mounted. If it wasn't, an error will be thrown. This behavior ensures that you are working with components within their intended lifecycle.

For example, the following code will throw an error:

```ts
import { backButton } from "@telegram-apps/sdk";

backButton.show();
// TypedError('ERR_NOT_MOUNTED') will be thrown
```
