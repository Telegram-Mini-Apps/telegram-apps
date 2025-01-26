# @telegram-apps/bridge

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
