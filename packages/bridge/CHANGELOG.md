# @tma.js/bridge

## 1.3.9

### Patch Changes

- 631a430: Replace log function from "@tma.js/logger" with Logger class
- Updated dependencies [631a430]
  - @tma.js/logger@0.0.5

## 1.3.8

### Patch Changes

- 3171451: Build packages in IIFE format
- Updated dependencies [3171451]
  - @tma.js/event-emitter@0.0.5
  - @tma.js/parsing@0.1.2
  - @tma.js/colors@0.0.5
  - @tma.js/logger@0.0.4
  - @tma.js/utils@0.5.5

## 1.3.7

### Patch Changes

- 3eafb45: Update package.json and fix entries for different modules.
- Updated dependencies [3eafb45]
  - @tma.js/event-emitter@0.0.4
  - @tma.js/parsing@0.1.1
  - @tma.js/colors@0.0.4
  - @tma.js/logger@0.0.3
  - @tma.js/utils@0.5.4
  - @tma.js/util-types@0.0.3

## 1.3.6

### Patch Changes

- Updated dependencies [bfbde56]
  - @tma.js/parsing@0.1.0

## 1.3.5

### Patch Changes

- d4153de: Add web_app_setup_settings_button method

## 1.3.4

### Patch Changes

- 3c6ed39: - Start using Vite instead of pure Rollup
  - Update all package.json files in all packages
  - Implement `build-utils` package to share build utilities across all packages
  - Refactor tsconfig.json files
  - Complicate examples for React and SDK
- Updated dependencies [3c6ed39]
  - @tma.js/event-emitter@0.0.3
  - @tma.js/util-types@0.0.3
  - @tma.js/parsing@0.0.3
  - @tma.js/colors@0.0.3
  - @tma.js/logger@0.0.2
  - @tma.js/utils@0.5.3

## 1.3.3

### Patch Changes

- 654891f: Add logging in case resize event occured

## 1.3.2

### Patch Changes

- 21c4632: Update docs URLs. Rename packages to @tma.js. Update deps
- Updated dependencies [21c4632]
- Updated dependencies [5a45fb7]
  - @tma.js/event-emitter@0.0.2
  - @tma.js/util-types@0.0.2
  - @tma.js/parsing@0.0.2
  - @tma.js/colors@0.0.2
  - @tma.js/utils@0.5.2
  - @tma.js/logger@0.0.1

## 1.3.1

### Patch Changes

- e947423: Update readme

## 1.3.0

### Minor Changes

- 5e23721: Implement new method - request. It allows calling specified methods and capturing specified events.

### Patch Changes

- Updated dependencies [53d1717]
- Updated dependencies [251c527]
  - @tma.js/utils@0.5.1
  - @twa.js/event-emitter@0.0.1
  - @twa.js/util-types@0.0.1
  - @twa.js/parsing@0.0.1
  - @twa.js/colors@0.0.1

## 1.2.0

### Minor Changes

- 6ac7862: Implement new methods: web_app_request_write_access, web_app_request_phone, web_app_invoke_custom_method

## 1.1.3

### Patch Changes

- 2ba1d95: Refactor imports in @twa.js/bridge. Add withTimeout function to @twa.js/utils. Use timeouts during initialization process
- Updated dependencies [2ba1d95]
  - @twa.js/utils@0.5.0

## 1.1.2

### Patch Changes

- Updated dependencies [3c6bc51]
  - @twa.js/utils@0.4.0

## 1.1.1

### Patch Changes

- Updated dependencies [5868e9f]
  - @twa.js/utils@0.3.0

## 1.1.0

### Minor Changes

- 43fe082: Add `subscribe` and `unsubscribe` functions.

## 1.0.0

### Major Changes

- 054d616: Fully rework bridge and release its first major update. Rename utilities in utils package. Make sdk components way better.

### Patch Changes

- Updated dependencies [054d616]
  - @twa.js/utils@0.2.12

## 0.3.9

### Patch Changes

- d0dd3ad: Fix bug related to ios and macOS environment detection. We are now looking at window.TelegramWebviewProxy.postEvent function to send an event.

## 0.3.8

### Patch Changes

- 0f69488: Add exports property in package json.
- Updated dependencies [0f69488]
  - @twa.js/utils@0.2.11

## 0.3.7

### Patch Changes

- 5879578: Add src folder to package. Also, inline source typescript source code.

## 0.3.6

### Patch Changes

- Updated dependencies [aeed89d]
  - @twa.js/utils@0.2.10

## 0.3.5

### Patch Changes

- a103e42: Optimize imports, fix minor bugs.
- Updated dependencies [a103e42]
  - @twa.js/utils@0.2.9
