# @tma.js/navigation

## 0.0.14

### Patch Changes

- Updated dependencies [57f0b23]
  - @tma.js/bridge@1.4.0

## 0.0.13

### Patch Changes

- Updated dependencies [44ed697]
- Updated dependencies [6b97921]
- Updated dependencies [7a6549c]
  - @tma.js/parsing@1.0.0
  - @tma.js/bridge@1.3.12

## 0.0.12

### Patch Changes

- 6469933: Actualize links and comments
- Updated dependencies [6469933]
  - @tma.js/parsing@0.1.3
  - @tma.js/bridge@1.3.11

## 0.0.11

### Patch Changes

- b9dff7a: Implement `getHash` method.
- Updated dependencies [8e5c7d4]
  - @tma.js/event-emitter@0.1.0
  - @tma.js/bridge@1.3.10

## 0.0.10

### Patch Changes

- e3524fa: Make `HashNavigator.back()` not method but property. This made TMA BackButton click handling work incorrectly.

## 0.0.9

### Patch Changes

- 817617e: Divide `Navigator` into 2 separate:

  1. `BasicNavigator` which encapsulates logic related to any type of navigation.
  2. `HashNavigator` which is based on `BasicNavigator` and allows client routing via `window.location.history` and location hash.

  This engagement allows developers to implement some other routers. For example, it allows creating `MemoryNavigator` or bind to the Next router.

## 0.0.8

### Patch Changes

- f9bbd6f: Reimplement package
- Updated dependencies [631a430]
  - @tma.js/bridge@1.3.9
  - @tma.js/logger@0.0.5

## 0.0.7

### Patch Changes

- 3171451: Build packages in IIFE format
- Updated dependencies [3171451]
  - @tma.js/event-emitter@0.0.5
  - @tma.js/parsing@0.1.2
  - @tma.js/bridge@1.3.8
  - @tma.js/logger@0.0.4

## 0.0.6

### Patch Changes

- 3eafb45: Update package.json and fix entries for different modules.
- Updated dependencies [3eafb45]
  - @tma.js/event-emitter@0.0.4
  - @tma.js/parsing@0.1.1
  - @tma.js/bridge@1.3.7
  - @tma.js/logger@0.0.3

## 0.0.5

### Patch Changes

- Updated dependencies [bfbde56]
  - @tma.js/parsing@0.1.0
  - @tma.js/bridge@1.3.6

## 0.0.4

### Patch Changes

- Updated dependencies [d4153de]
  - @tma.js/bridge@1.3.5

## 0.0.3

### Patch Changes

- 3c6ed39: - Start using Vite instead of pure Rollup
  - Update all package.json files in all packages
  - Implement `build-utils` package to share build utilities across all packages
  - Refactor tsconfig.json files
  - Complicate examples for React and SDK
- Updated dependencies [3c6ed39]
  - @tma.js/event-emitter@0.0.3
  - @tma.js/parsing@0.0.3
  - @tma.js/bridge@1.3.4
  - @tma.js/logger@0.0.2

## 0.0.2

### Patch Changes

- Updated dependencies [654891f]
  - @tma.js/bridge@1.3.3

## 0.0.1

### Patch Changes

- f1d2932: Implement new package
- Updated dependencies [21c4632]
- Updated dependencies [5a45fb7]
  - @tma.js/event-emitter@0.0.2
  - @tma.js/parsing@0.0.2
  - @tma.js/bridge@1.3.2
  - @tma.js/logger@0.0.1
