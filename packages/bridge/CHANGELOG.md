# @telegram-apps/bridge

## 2.10.3

### Patch Changes

- f746abf: Remove #**NO_SIDE_EFFECTS** annotations in some helpers working with Object.defineProperty fn.

## 2.10.2

### Patch Changes

- Updated dependencies [d2a8ab8]
  - @telegram-apps/types@2.0.3
  - @telegram-apps/transformers@2.2.6

## 2.10.1

### Patch Changes

- Updated dependencies [22263fd]
  - @telegram-apps/types@2.0.2
  - @telegram-apps/transformers@2.2.5

## 2.10.0

### Minor Changes

- ca06cda: Allow using the @telegram-apps packages along with the Telegram SDK.
- 9a7df33: Allow passing custom argument value type in `createStartParam`. Enhance `decodeStartParam` functionality with optional parsing.

## 2.9.0

### Minor Changes

- 0c4b5fd: Implement `applyPolyfills` function.
- 9d2ca07: - Implement utilities to work with base64url
  - Implement utilities to work with start param

## 2.8.3

### Patch Changes

- 9b9a368: Update LICENSE file
- Updated dependencies [9b9a368]
  - @telegram-apps/transformers@2.2.4
  - @telegram-apps/signals@1.1.2
  - @telegram-apps/toolkit@2.1.3
  - @telegram-apps/types@2.0.1

## 2.8.2

### Patch Changes

- Updated dependencies [5631780]
  - @telegram-apps/toolkit@2.1.2
  - @telegram-apps/transformers@2.2.3

## 2.8.1

### Patch Changes

- Updated dependencies [15b9921]
  - @telegram-apps/toolkit@2.1.1
  - @telegram-apps/transformers@2.2.2

## 2.8.0

### Minor Changes

- 9623c36: - Handle target origin related error when calling `window.parent.postMessage`
  - Implement `setTargetOrigin`
  - Allow mutating the package logger

### Patch Changes

- Updated dependencies [0c3d369]
  - @telegram-apps/toolkit@2.1.0
  - @telegram-apps/transformers@2.2.1

## 2.7.1

### Patch Changes

- ca3c434: Disallow using `bg_color` and `secondary_bg_color` when calling `web_app_set_background_color`. Do the same with `web_app_set_bottom_bar_color` and also disallow `bottom_bar_bg_color` value.

## 2.7.0

### Minor Changes

- 321cb43: Implement `postMessage` function and related `postMessageImplementation` signal. Enhance `mockTelegramEnv` with `resetPostMessage` option and properly wrap the `window.parent.postMessage` method. Add explanation on why passed launch parameters are invalid.

## 2.6.0

### Minor Changes

- 8d1a118: Add collected errors in `retrieveRawLaunchParams`.

## 2.5.0

### Minor Changes

- 95cef36: Add exports from `better-promises`.

## 2.4.0

### Minor Changes

- a88723a: Add formatter for int theme params

### Patch Changes

- Updated dependencies [a88723a]
  - @telegram-apps/transformers@2.2.0

## 2.3.2

### Patch Changes

- c0469ff: Actualize README.

## 2.3.1

### Patch Changes

- 0e4977e: Use `Maybe` from `@telegram-apps/toolkit` instead of a type from declarations' file

## 2.3.0

### Minor Changes

- 35d9f85: Implement `retrieveRawLaunchParams`.

## 2.2.0

### Minor Changes

- fa0a328: Add v8 methods and events.

## 2.1.0

### Minor Changes

- 0e8b869: Add `retrieveRawInitData` utility. Set launchParams.tgWebAppData to string or URLSearchParams in `mockTelegramEnv`

### Patch Changes

- Updated dependencies [cc94a1e]
  - @telegram-apps/transformers@2.1.0

## 2.0.1

### Patch Changes

- 2366db8: Use more correct types for `RetrieveLPResult` and `RetrieveLPResultCamelCased`
- Updated dependencies [5f755c7]
  - @telegram-apps/toolkit@2.0.0
  - @telegram-apps/transformers@2.0.0
  - @telegram-apps/types@2.0.0

## 2.0.0

### Major Changes

- 935ccef: - Remove `subscribe`, `unsubscribe`, `defineEventHandlers`, `$debug`, `$targetOrigin` variables.
  - Allow listening to all events via `on('*', listener)`
  - Set debug mode via `setDebug`
  - Simplify `retrieveLaunchParams` and return a reworked `LaunchParams` type
  - By default `isTMA` know uses simple way via retrieving launch params. `simple` argument was replaced with `complete`
  - Add `valibot`, `better-promises`, `mitt` and `error-kid` as dependencies

## 1.9.2

### Patch Changes

- bd6c0c5: Update the link returned if the `retrieveLaunchParams` function failed.

## 1.9.1

### Patch Changes

- 68e4a6d: Remove src and tsconfig files from distributive
- Updated dependencies [68e4a6d]
  - @telegram-apps/transformers@1.2.2
  - @telegram-apps/signals@1.1.1
  - @telegram-apps/toolkit@1.1.1
  - @telegram-apps/types@1.2.1

## 1.9.0

### Minor Changes

- bb72227: Implement `home_screen_added`, `home_screen_checked` and `home_screen_failed` events. Implement `web_app_add_to_home_screen` and `web_app_check_home_screen` methods.

### Patch Changes

- Updated dependencies [3a93d64]
  - @telegram-apps/toolkit@1.1.0
  - @telegram-apps/transformers@1.2.1

## 1.8.0

### Minor Changes

- 3366f0c: Add `visibility_changed` event.

## 1.7.1

### Patch Changes

- Updated dependencies [d5e3d90]
- Updated dependencies [12e0cd1]
  - @telegram-apps/types@1.2.0
  - @telegram-apps/transformers@1.2.0

## 1.7.0

### Minor Changes

- 7c6d9d3: Add methods and events connected with custom emoji set.

## 1.6.0

### Minor Changes

- 0de133d: Add Safe Area functionality

## 1.5.0

### Minor Changes

- a037cc9: Remove `viewport_changed` event generation on window resize as it is currently supported by the most of Telegram applications.

  Implement `fullscreen_changed`, `fullscreen_failed`, `web_app_request_fullscreen` and `web_app_exit_fullscreen` events and methods.

### Patch Changes

- Updated dependencies [6d5c74d]
- Updated dependencies [7b2f160]
  - @telegram-apps/types@1.1.0
  - @telegram-apps/transformers@1.1.0

## 1.4.0

### Minor Changes

- a92abf4: - Add new custom method `getCurrentTime`
  - Add `web_app_setup_secondary_button` method missing version annotation

### Patch Changes

- Updated dependencies [16742d5]
  - @telegram-apps/signals@1.1.0

## 1.3.0

### Minor Changes

- 5346f76: "Add web_app_share_to_story" to `supports` checks.

## 1.2.1

### Patch Changes

- 06f6720: Fix some links in README.
- Updated dependencies [06f6720]
  - @telegram-apps/signals@1.0.1

## 1.2.0

### Minor Changes

- 7a7829a: - Add `web_app_set_bottom_bar_color` in `supports`
  - Widen type for `web_app_set_background_color.color`
  - Add `web_app_setup_secondary_button.position`

## 1.1.0

### Minor Changes

- 74dfc59: Add web_app_set_bottom_bar_color method typings. Add BottomBarColor type.

### Patch Changes

- Updated dependencies [b27e6fa]
  - @telegram-apps/types@1.0.1
  - @telegram-apps/transformers@1.0.1
