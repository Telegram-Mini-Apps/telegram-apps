# Debugging

Application development is rather hard and continous process which requires a lot of time
and patience. To simplify it, the Telegram Mini Apps platform allows debugging developed
application.

## Enabling Debug Mode

### Telegram Desktop

- Download and launch the [Beta Version](https://desktop.telegram.org/changelog#beta-version) of
  Telegram Desktop.
- Open the side menu and navigate to `Settings > Advanced`.
- Scroll down the opened menu and click the `Experimental settings` button.
- Check the `Enable webview inspecting` option.

When the debug mode is enabled, right-clicking in the Mini App will display a context menu with
the `Inspect` option, allowing you to open developer tools.

### Telegram for macOS

- Download and launch the [Beta Version](https://telegram.org/dl/macos/beta) of Telegram macOS.
- Quickly click 5 times on the Settings icon to open the Debug Menu and enable `Debug Mini Apps`
  option.

As well as in Telegram Desktop, `Inspect Element` option will appear in the context menu.

### Telegram for Android

- [Enable USB-Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/) on your
  device.
- In Telegram Settings, scroll all the way down, press and hold on the **version number** two times.
- Choose `Enable WebView Debug` in the Debug Settings.
- Connect your phone to your computer and open `chrome://inspect/#devices` in Chrome – you will see
  your Mini App there when you launch it on your phone.

### Telegram for iOS

iOS webview debugging requires Safari desktop browser and therefore macOS.

To access iOS debugging features without macOS, refer to the [Eruda](#eruda) section.

On iOS device:
- Go to `Settings`.
- Find Safari icon and press on it.
- Scroll down and press `Advanced`.
- Enable `Web Inspector` option.

On macOS:
- Open Safari browser.
- Open `Settings` (`⌘ + ,`).
- Select `Advanced` tab.
- Check `Show features for web developers` option at the bottom.

Next steps:
- Connect iOS device to Mac via cable.
- Open Mini App inside iOS Telegram client.
- Open `Develop` tab in the menu bar in Safari on macOS.
- Select connected iPhone.
- Optional: select `Connect via network` and disconnect the cable.
- Select opened webview URL under `Telegram` block.

## Eruda

[Eruda](https://www.npmjs.com/package/eruda) is a technology that provides a lightweight console in
the web. We typically use such packages in environments that don't offer their own consoles.

First of all, it is necessary to install the package and initialize it.

::: code-group

```html [script tag]

<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init()</script>
```

```typescript [npm package]
import eruda from 'eruda';

eruda.init();
```

:::

After eruda is initialized, you will see its element in the UI. Clicking on it will display the
console.