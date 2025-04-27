# @telegram-apps/sdk

## 3.9.1

### Patch Changes

- Updated dependencies [15b9921]
  - @telegram-apps/toolkit@2.1.1
  - @telegram-apps/bridge@2.8.1
  - @telegram-apps/transformers@2.2.2

## 3.9.0

### Minor Changes

- b606f93: Allow mutating the package logger.

### Patch Changes

- Updated dependencies [0c3d369]
- Updated dependencies [9623c36]
  - @telegram-apps/toolkit@2.1.0
  - @telegram-apps/bridge@2.8.0
  - @telegram-apps/transformers@2.2.1

## 3.8.0

### Minor Changes

- 9153b7c: - Implement `requestContactComplete`
  - Allow using wider range of values in mini-app's `setBackgroundColor`, `setHeaderColor` and `setBottomBarColor` methods
  - Bump deps
  - Implement `UnknownThemeParamsKeyError`

### Patch Changes

- Updated dependencies [ca3c434]
  - @telegram-apps/bridge@2.7.1

## 3.7.1

### Patch Changes

- Updated dependencies [321cb43]
  - @telegram-apps/bridge@2.7.0

## 3.7.0

### Minor Changes

- afa91c2: Implement `mountMiniAppSync`. Deprecate all async related entities.
- 94b6be3: Implement `mountThemeParamsSync`. Don't request theme params in its async version. Deprecate all async mount-related entities.

### Patch Changes

- Updated dependencies [8d1a118]
  - @telegram-apps/bridge@2.6.0

## 3.6.0

### Minor Changes

- 95cef36: Add exports from `better-promises`.

### Patch Changes

- Updated dependencies [95cef36]
  - @telegram-apps/bridge@2.5.0

## 3.5.4

### Patch Changes

- 82ec9cf: Fix invalid cloud storage get item behavior

## 3.5.3

### Patch Changes

- 503171f: Move inline check from sendData to switchInlineQuery.

## 3.5.2

### Patch Changes

- 94a3558: Fix ivalid typings in `openPopup` function.

## 3.5.1

### Patch Changes

- Updated dependencies [a88723a]
  - @telegram-apps/bridge@2.4.0
  - @telegram-apps/transformers@2.2.0

## 3.5.0

### Minor Changes

- c25520f: Implement `copyTextToClipboard` and `downloadFile`.

## 3.4.0

### Minor Changes

- 8e392b4: Implement `locationManager.isSupported()`.

## 3.3.2

### Patch Changes

- 4b5d4f0: Set valid source properties for computed color signals in theme params.

## 3.3.1

### Patch Changes

- d035dc5: Actualize ConfigureOptions.postEvent comments.
- Updated dependencies [c0469ff]
  - @telegram-apps/bridge@2.3.2

## 3.3.0

### Minor Changes

- c36aa39: Implement `locationManager.openSettings` method. Exports location manager's `unmount` method. Fix invalid method name for `requestLocation`

## 3.2.0

### Minor Changes

- fbcfd81: Implement location manager. Implement `shareMessage`. Add support check to `biometryManager.mount()`.

### Patch Changes

- Updated dependencies [0e4977e]
  - @telegram-apps/bridge@2.3.1

## 3.1.3

### Patch Changes

- 7825425: Fix problems related to signals' tuples and batched updates

## 3.1.2

### Patch Changes

- e356df3: Remove some errors exported from bridge.
- Updated dependencies [35d9f85]
  - @telegram-apps/bridge@2.3.0

## 3.1.1

### Patch Changes

- Updated dependencies [fa0a328]
  - @telegram-apps/bridge@2.2.0

## 3.1.0

### Minor Changes

- c1d3b56: Fix incorrect `initData.restore()` behavior. Add more exports from bridge.

### Patch Changes

- Updated dependencies [0e8b869]
- Updated dependencies [cc94a1e]
  - @telegram-apps/bridge@2.1.0
  - @telegram-apps/transformers@2.1.0

## 3.0.0

### Minor Changes

- c32ba70: Add more exports from @telegram-apps/transformers

### Patch Changes

- Updated dependencies [5f755c7]
- Updated dependencies [2366db8]
  - @telegram-apps/toolkit@2.0.0
  - @telegram-apps/transformers@2.0.0
  - @telegram-apps/types@2.0.0
  - @telegram-apps/bridge@2.0.1

## 3.0.0-beta.1

### Major Changes

- 56cee21: - Update exports from `@telegram-apps/bridge`
  - Add `better-promises`, `valibot` and `error-kid` as dependencies
  - Update init data and launch params types

### Patch Changes

- Updated dependencies [935ccef]
  - @telegram-apps/bridge@2.0.0

## 2.11.3

### Patch Changes

- Updated dependencies [bd6c0c5]
  - @telegram-apps/bridge@1.9.2
  - @telegram-apps/navigation@1.0.13

## 2.11.2

### Patch Changes

- 8ed92d4: Use `web_app_check_home_screen` in `checkHomeScreenStatus`

## 2.11.1

### Patch Changes

- 68e4a6d: Remove src and tsconfig files from distributive
- Updated dependencies [68e4a6d]
  - @telegram-apps/transformers@1.2.2
  - @telegram-apps/navigation@1.0.12
  - @telegram-apps/signals@1.1.1
  - @telegram-apps/toolkit@1.1.1
  - @telegram-apps/bridge@1.9.1

## 2.11.0

### Minor Changes

- ea81517: Implement add to home screen-related functionality.

### Patch Changes

- Updated dependencies [3a93d64]
- Updated dependencies [bb72227]
  - @telegram-apps/toolkit@1.1.0
  - @telegram-apps/bridge@1.9.0
  - @telegram-apps/navigation@1.0.11
  - @telegram-apps/transformers@1.2.1

## 2.10.0

### Minor Changes

- 7d6ec83: Add functionality related to the mini apps active state.

### Patch Changes

- Updated dependencies [3366f0c]
  - @telegram-apps/bridge@1.8.0
  - @telegram-apps/navigation@1.0.10

## 2.9.1

### Patch Changes

- Updated dependencies [12e0cd1]
  - @telegram-apps/transformers@1.2.0
  - @telegram-apps/bridge@1.7.1
  - @telegram-apps/navigation@1.0.9

## 2.9.0

### Minor Changes

- 554750e: Add emoji status-related functionality.

### Patch Changes

- Updated dependencies [7c6d9d3]
  - @telegram-apps/bridge@1.7.0
  - @telegram-apps/navigation@1.0.8

## 2.8.1

### Patch Changes

- 2250c37: Fix Safe Area state update

## 2.8.0

### Minor Changes

- 0de133d: Add Safe Area functionality

### Patch Changes

- Updated dependencies [0de133d]
  - @telegram-apps/bridge@1.6.0
  - @telegram-apps/navigation@1.0.7

## 2.7.1

### Patch Changes

- 3e81316: Fix `fullscreen` should only be exposed in viewport

## 2.7.0

### Minor Changes

- 1d3a1e9: Enhance the `viewport` with new fullscreen functionality.

### Patch Changes

- Updated dependencies [a037cc9]
- Updated dependencies [7b2f160]
  - @telegram-apps/bridge@1.5.0
  - @telegram-apps/transformers@1.1.0
  - @telegram-apps/navigation@1.0.6

## 2.6.2

### Patch Changes

- 78508aa: Fix `requestContact` invalid async executor

## 2.6.1

### Patch Changes

- 9683cd7: Replace "Back button" to "Main button" in the main button docs

## 2.6.0

### Minor Changes

- 11c839c: - Now almost each scope-related method has additional methods/signals: `isAvailable`, `isSupported`, `supports` and `ifAvailable`
  - Add new errors
  - Add clear error messages
  - Add more tests

### Patch Changes

- Updated dependencies [a92abf4]
- Updated dependencies [16742d5]
  - @telegram-apps/bridge@1.4.0
  - @telegram-apps/signals@1.1.0
  - @telegram-apps/navigation@1.0.5

## 2.5.2

### Patch Changes

- 0ed8e95: Fix invalid initial value for swipeBehavior.isVerticalEnabled

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
