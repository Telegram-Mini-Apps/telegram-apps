# 主题参数

该组件包含 Telegram 应用程序当前使用的
[主题]（././././././平台/主题.md）信息。

## 初始化

要初始化组件，请使用 `initThemeParams` 函数：

```typescript
import { initThemeParams } from '@telegram-apps/sdk';

const [themeParams] = initThemeParams()；  
```

## 索取实际数据

要获取实际的主题参数信息，开发人员可以使用 `requestThemeParams`
函数：

```typescript
import { requestThemeParams } from '@telegram-apps/sdk';

requestThemeParams.then(console.log);

// Output：
// { bgColor: '#ffaabb', ... }
```

## 颜色

开发人员可以使用 `get` 方法获取主题颜色：

```typescript
themeParams.get('bgColor');
themeParams.get('packageUnknownColor')；
```

要通过一个对象获取所有颜色，请使用 `getState` 方法：

```typescript
themeParams.getState();
// 输出：
// {
// accentTextColor: '#aa1399',
// bgColor: '#baac12',
// linkColor: '#887722'
// packageUnknownColor: '#676767,
// }
```

ThemeParams "组件可直接访问颜色列表：

- `accentTextColor: RGB | undefined`.
- bgColor: RGB | 未定义
- 按钮颜色：RGB | 未定义
- 按钮文本颜色：RGB | 未定义
- 破坏性文本颜色：RGB | 未定义
- 标题颜色：RGB | 未定义
- 提示颜色：RGB | 未定义
- 链接颜色：RGB | 未定义
- `secondaryBgColor: RGB | undefined`.
- `sectionBgColor: RGB | undefined` SectionBgColor: RGB | undefined
- `sectionHeaderTextColor: RGB | undefined` SectionHeaderTextColor: RGB | undefined
- 副标题文本颜色：RGB | 未定义
- 文本颜色：RGB | 未定义

例如

```typescript
themeParams.accentTextColor; // "#aa1399
```

## 活动

可被 [跟踪]（#events）的事件列表：

| 活动                   | 听众                                                            | 触发条件          |
| -------------------- | ------------------------------------------------------------- | ------------- |
| 改变                   | `() => void`                                                  | 组件中的某些部分发生了变化 |
| `change:{theme_key}` | \`(value: RGB) => void\`\` | 更改指定键的颜色      |
