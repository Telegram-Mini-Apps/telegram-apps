---
sidebar_position: 2
---

# Types

Here comes the information about which events are currently known - their names
and payloads.

### `back_button_pressed`

User clicked back button.

*No payload.*

### `invoice_closed`

Invoice was closed.

```typescript
type Payload = {
  slug: string;
  status: 'paid' | 'failed' | 'pending' | 'cancelled';
}
```

### `main_button_pressed`

User clicked main button.

*No payload.*

### `popup_closed`

Popup was closed. Payload will contain `button_id` which is identifier of
clicked button. In case, no button was clicked, payload will be empty
object (`{}`).

```typescript
type Payload = { button_id?: string }
```

:::danger

This event works incorrectly in some platforms.
See [issue](https://github.com/Telegram-Web-Apps/twa/issues/2).

:::

### `set_custom_style`

Telegram requested to update current application style.

```typescript
// <style/> tag html content.
type Payload = string; 
```

### `settings_button_pressed`

Occurs when the `Settings` item in context menu was pressed.

*No payload.*

### `theme_changed`

Occurs whenever theme settings are changed in the user's Telegram app
(including switching to night mode).

```typescript
type Payload = { theme_params: Record<string, string> };
```

### `viewport_changed`

Viewport was changed.

```typescript
type Payload = {
  height: number;
  width?: number;
  is_expanded: boolean;
  is_state_stable: boolean;
};
```

:::danger

This event has related issues.

- [#10](https://github.com/Telegram-Web-Apps/twa/issues/10)
- [#11](https://github.com/Telegram-Web-Apps/twa/issues/11)

:::