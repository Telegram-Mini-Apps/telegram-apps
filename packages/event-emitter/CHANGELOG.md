# @tma.js/event-emitter

## 0.1.0

### Minor Changes

- 8e5c7d4: Improve `emit` method code. Return remove event listener function from `on` and `once` methods. Do the same with `subscribe` method. `off` and `unsubscribe` methods now remove only 1 listener, not all its instances.

## 0.0.5

### Patch Changes

- 3171451: Build packages in IIFE format

## 0.0.4

### Patch Changes

- 3eafb45: Update package.json and fix entries for different modules.
  - @tma.js/util-types@0.0.3

## 0.0.3

### Patch Changes

- 3c6ed39: - Start using Vite instead of pure Rollup
  - Update all package.json files in all packages
  - Implement `build-utils` package to share build utilities across all packages
  - Refactor tsconfig.json files
  - Complicate examples for React and SDK
- Updated dependencies [3c6ed39]
  - @tma.js/util-types@0.0.3

## 0.0.2

### Patch Changes

- 21c4632: Update docs URLs. Rename packages to @tma.js. Update deps
- Updated dependencies [21c4632]
  - @tma.js/util-types@0.0.2

## 0.0.1

### Patch Changes

- 251c527: Release package.
- Updated dependencies [251c527]
  - @twa.js/util-types@0.0.1
