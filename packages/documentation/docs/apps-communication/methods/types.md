---
sidebar_position: 2
---

# Types

Here comes the information about which methods are currently known - their names
and parameters. You will see minimal Web App version on the right from method
name.

### `iframe_ready`

Notifies parent iframe about current frame is ready.

*No parameters.*

### `web_app_close`

Closes WebApp.

*No parameters.*

### `web_app_data_send`

Sends data to bot.

```typescript
type Parameters = { data: string };
```

### `web_app_expand`

Expands Web App.

*No parameters.*

### `web_app_open_link`

Opens link in default browser. Doesn't close application.

```typescript
type Parameters = { url: string };
```

### `web_app_open_tg_link` <sup>`v6.1+`</sup>

Opens link which has format like "https://t.me/*".

```typescript
type Parameters = { path_full: string };
```

### `web_app_open_popup` <sup>`v6.2+`</sup>

Opens new popup.

```typescript
type PopupButton = {
  /**
   * Identifier of the button, 0-64 characters.
   */
  id: string;
} & (
  {
    /**
     * Type of the button:
     * - `default`, a button with the default style;
     * - `destructive`, a button with a style that indicates a destructive
     * action (e.g. "Remove", "Delete", etc.).
     *
     * @default "default"
     */
    type?: 'default' | 'destructive';

    /**
     * The text to be displayed on the button, 0-64 characters.
     */
    text: string;
  } | {
  /**
   * Type of the button:
   * - `ok`, a button with the localized text "OK";
   * - `close`, a button with the localized text "Close";
   * - `cancel`, a button with the localized text "Cancel".
   */
  type: 'ok' | 'close' | 'cancel';
});

type Parameters = {
  /**
   * The text to be displayed in the popup title, 0-64 characters.
   */
  title: string;
  /**
   * The message to be displayed in the body of the popup, 1-256 characters.
   */
  message: string;
  /**
   * List of buttons to be displayed in the popup, 1-3 buttons.
   */
  buttons: PopupButton[];
};
```

### `web_app_open_invoice` <sup>`v6.1+`</sup>

Opens new invoice.

```typescript
type Parameters = { slug: string };
```

### `web_app_ready`

Notifies Telegram about current application is ready to be shown.

*No parameters.*

### `web_app_request_theme`

Requests current theme from Telegram.

*No parameters.*

### `web_app_request_viewport`

Requests current viewport information from Telegram.

*No parameters.*

### `web_app_setup_back_button` <sup>`v6.1+`</sup>

Updates current information about back button.

```typescript
type Parameters = { is_visible: boolean };
```

### `web_app_setup_main_button`

Updates current information about back button.

```typescript
type Parameters = {
  is_visible?: boolean;
  is_active?: boolean;
  is_progress_visible?: boolean;
  text?: string;
  color?: string;
  text_color?: string;
};
```

### `web_app_setup_closing_behavior`

Changes current closing confirmation requirement status.

```typescript
type Parameters = { need_confirmation: boolean };
```

### `web_app_set_background_color` <sup>`v6.1+`</sup>

Updates current background color.

```typescript
type Parameters = { color: string };
```

### `web_app_set_header_color` <sup>`v6.1+`</sup>

Updates current header color.

```typescript
type Parameters = { color_key: 'bg_color' | 'secondary_bg_color' };
```

### `web_app_trigger_haptic_feedback` <sup>`v6.1+`</sup>

Generates haptic feedback event.

```typescript
type Parameters = {
  type: 'impact',
  /**
   * Style of impact occurred haptic event.
   * - `light`, indicates a collision between small or lightweight UI objects,
   * - `medium`, indicates a collision between medium-sized or medium-weight UI objects,
   * - `heavy`, indicates a collision between large or heavyweight UI objects,
   * - `rigid`, indicates a collision between hard or inflexible UI objects,
   * - `soft`, indicates a collision between soft or flexible UI objects.
   */
  impact_style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft',
} | {
  type: 'notification',
  /**
   * Type of notification occurred type event.
   * - `error`, indicates that a task or action has failed,
   * - `success`, indicates that a task or action has completed successfully,
   * - `warning`, indicates that a task or action produced a warning.
   */
  notification_type: 'error' | 'success' | 'warning'
} | {
  type: 'selection_change'
};
```