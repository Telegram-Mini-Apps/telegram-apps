# @tma.js/sdk

## 0.12.4

### Patch Changes

- 3171451: Build packages in IIFE format
- Updated dependencies [3171451]
  - @tma.js/event-emitter@0.0.5
  - @tma.js/launch-params@0.0.4
  - @tma.js/theme-params@0.0.4
  - @tma.js/init-data@0.2.18
  - @tma.js/parsing@0.1.2
  - @tma.js/bridge@1.3.8
  - @tma.js/colors@0.0.5
  - @tma.js/utils@0.5.5

## 0.12.3

### Patch Changes

- c890f2d: Add missing chatType and chatInstance properties

## 0.12.2

### Patch Changes

- 3eafb45: Update package.json and fix entries for different modules.
- Updated dependencies [3eafb45]
  - @tma.js/event-emitter@0.0.4
  - @tma.js/launch-params@0.0.3
  - @tma.js/theme-params@0.0.3
  - @tma.js/init-data@0.2.17
  - @tma.js/parsing@0.1.1
  - @tma.js/bridge@1.3.7
  - @tma.js/colors@0.0.4
  - @tma.js/utils@0.5.4
  - @tma.js/util-types@0.0.3

## 0.12.1

### Patch Changes

- Updated dependencies [8ef4f81]
- Updated dependencies [bfbde56]
  - @tma.js/init-data@0.2.16
  - @tma.js/parsing@0.1.0
  - @tma.js/launch-params@0.0.2
  - @tma.js/bridge@1.3.6
  - @tma.js/theme-params@0.0.2

## 0.12.0

### Minor Changes

- e7add9d: Restore components state only in case, current page was reloaded.

### Patch Changes

- Updated dependencies [4df61ce]
  - @tma.js/launch-params@0.0.1
  - @tma.js/theme-params@0.0.1

## 0.11.6

### Patch Changes

- Updated dependencies [d4153de]
  - @tma.js/bridge@1.3.5

## 0.11.5

### Patch Changes

- 3c6ed39: - Start using Vite instead of pure Rollup
  - Update all package.json files in all packages
  - Implement `build-utils` package to share build utilities across all packages
  - Refactor tsconfig.json files
  - Complicate examples for React and SDK
- Updated dependencies [3c6ed39]
  - @tma.js/event-emitter@0.0.3
  - @tma.js/util-types@0.0.3
  - @tma.js/init-data@0.2.15
  - @tma.js/parsing@0.0.3
  - @tma.js/bridge@1.3.4
  - @tma.js/colors@0.0.3
  - @tma.js/utils@0.5.3

## 0.11.4

### Patch Changes

- Updated dependencies [654891f]
  - @tma.js/bridge@1.3.3

## 0.11.3

### Patch Changes

- 21c4632: Update docs URLs. Rename packages to @tma.js. Update deps
- Updated dependencies [21c4632]
  - @tma.js/event-emitter@0.0.2
  - @tma.js/util-types@0.0.2
  - @tma.js/init-data@0.2.14
  - @tma.js/parsing@0.0.2
  - @tma.js/bridge@1.3.2
  - @tma.js/colors@0.0.2
  - @tma.js/utils@0.5.2

## 0.11.2

### Patch Changes

- f1675d2: Fix viewport request in init function for Web K version.

## 0.11.1

### Patch Changes

- e947423: Update readme
- Updated dependencies [e947423]
  - @twa.js/bridge@1.3.1
  - @twa.js/init-data@0.2.13

## 0.11.0

### Minor Changes

- faaa346: Implement new CloudStorage component. Implement 6.9 methods. Make components restore from the session storage.

### Patch Changes

- Updated dependencies [5e23721]
- Updated dependencies [53d1717]
- Updated dependencies [251c527]
- Updated dependencies [665dcf4]
  - @twa.js/bridge@1.3.0
  - @twa.js/utils@0.5.1
  - @twa.js/event-emitter@0.0.1
  - @twa.js/util-types@0.0.1
  - @twa.js/parsing@0.0.1
  - @twa.js/colors@0.0.1
  - @twa.js/init-data@0.2.12

## 0.10.0

### Minor Changes

- 562e0c1: Improve cssVars option

## 0.9.1

### Patch Changes

- Updated dependencies [6ac7862]
  - @twa.js/bridge@1.2.0

## 0.9.0

### Minor Changes

- 87d0a68: Add isTWA function which checks if current environment is Telegram Web Apps. Export more utilities and types

## 0.8.0

### Minor Changes

- 2ba1d95: Refactor imports in @twa.js/bridge. Add withTimeout function to @twa.js/utils. Use timeouts during initialization process

### Patch Changes

- Updated dependencies [2ba1d95]
  - @twa.js/utils@0.5.0
  - @twa.js/bridge@1.1.3
  - @twa.js/init-data@0.2.11

## 0.7.3

### Patch Changes

- 5339167: Export misc types related to the platform

## 0.7.2

### Patch Changes

- 3c6bc51: Improve class names utilities. Re-export them in Solid SDK
- Updated dependencies [3c6bc51]
  - @twa.js/utils@0.4.0
  - @twa.js/bridge@1.1.2
  - @twa.js/init-data@0.2.10

## 0.7.1

### Patch Changes

- e71cea4: Add parseLaunchParams function to exports

## 0.7.0

### Minor Changes

- 8a0e39f: Allow passing custom launch parameters value into init function

## 0.6.0

### Minor Changes

- 04c2ce6: Add bug related to recursive calls of postEvent function. Allow usage of raw init data. Add an option to create global CSS variables.

## 0.5.3

### Patch Changes

- Updated dependencies [5868e9f]
  - @twa.js/utils@0.3.0
  - @twa.js/bridge@1.1.1
  - @twa.js/init-data@0.2.9

## 0.5.2

### Patch Changes

- 450e85e: Use methods instead of setters for header and background colors

## 0.5.1

### Patch Changes

- Updated dependencies [43fe082]
  - @twa.js/bridge@1.1.0

## 0.5.0

### Minor Changes

- 054d616: Fully rework bridge and release its first major update. Rename utilities in utils package. Make sdk components way better.

### Patch Changes

- Updated dependencies [054d616]
  - @twa.js/bridge@1.0.0
  - @twa.js/init-data@0.2.8
  - @twa.js/utils@0.2.12

## 0.4.6

### Patch Changes

- Updated dependencies [d0dd3ad]
  - @twa.js/bridge@0.3.9

## 0.4.5

### Patch Changes

- 684f0c0: Make init data optional launch parameter. This parameter could be missing in case, application was launched via inline keyboard button.

## 0.4.4

### Patch Changes

- 0f69488: Add exports property in package json.
- Updated dependencies [0f69488]
  - @twa.js/init-data@0.2.7
  - @twa.js/bridge@0.3.8
  - @twa.js/utils@0.2.11

## 0.4.3

### Patch Changes

- 5879578: Add src folder to package. Also, inline source typescript source code.
- Updated dependencies [5879578]
  - @twa.js/init-data@0.2.6
  - @twa.js/bridge@0.3.7

## 0.4.2

### Patch Changes

- Updated dependencies [aeed89d]
  - @twa.js/utils@0.2.10
  - @twa.js/bridge@0.3.6
  - @twa.js/init-data@0.2.5

## 0.4.1

### Patch Changes

- a103e42: Optimize imports, fix minor bugs.
- Updated dependencies [a103e42]
  - @twa.js/init-data@0.2.4
  - @twa.js/bridge@0.3.5
  - @twa.js/utils@0.2.9
