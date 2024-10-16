# @telegram-apps/sdk

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
