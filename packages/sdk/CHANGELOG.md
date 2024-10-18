# @telegram-apps/sdk

## 2.5.1

### Patch Changes

- 4c9581f: Fix invalid Mini App mount using theme params RGB header color

## 2.5.0

### Minor Changes

- 34b2595: We realized that many developers might be using the SDK without knowing that some functionality they're using may not work. This is due to the non-strict `postEvent` function in the `init` function:

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

### Patch Changes

- Updated dependencies [5346f76]
  - @telegram-apps/bridge@1.3.0
  - @telegram-apps/navigation@1.0.4

## 2.4.1

### Patch Changes

- 521a23e: Fix qr scanner capture logic

## 2.4.0

### Minor Changes

- 96dec34: Make mountable components now send their state to the Telegram application on mount.

## 2.3.1

### Patch Changes

- 06f6720: Fix some links in README.
- Updated dependencies [06f6720]
  - @telegram-apps/navigation@1.0.3
  - @telegram-apps/signals@1.0.1
  - @telegram-apps/bridge@1.2.1

## 2.3.0

### Minor Changes

- 7279f66: Fix bottom buttons color change invalid behavior.

## 2.2.0

### Minor Changes

- 34652a2: - Enhance the Secondary Button with the `position` signal. Export the component
  - Add bottom bar related functionality in the Mini App component

### Patch Changes

- Updated dependencies [7a7829a]
  - @telegram-apps/bridge@1.2.0
  - @telegram-apps/navigation@1.0.2

## 2.1.0

### Minor Changes

- baa1994: - Add the Main Button `hasShineEffect` signal.
  - Fix the Main Button default values closer to the Telegram SDK's.
  - Add Theme Params `bottomBarBgColor` signal.
  - Implement `shareStory` function.

### Patch Changes

- Updated dependencies [74dfc59]
  - @telegram-apps/bridge@1.1.0
  - @telegram-apps/navigation@1.0.1
  - @telegram-apps/transformers@1.0.1

## 2.0.0

### Major Changes

- 6599d7a: This new major version of the SDK includes complete rework. This is probably the final its form.

## 1.1.3

### Patch Changes

- 0ac4c50: Re-use captured errors in `retrieveLaunchParams`. Make error more clear.

## 1.1.2

### Patch Changes

- fd30596: Make the `postEvent` function intellisense a bit better.

## 1.1.1

### Patch Changes

- 2dbbd42: Make retrieveLaunchParams error message clearer, add link to docs

## 1.1.0

### Minor Changes

- 54adc6f: Add the `SwipeBehavior` component, related hooks and HOCs.
