# @telegram-apps/mate

Mate 是 Telegram Mini Apps
平台为开发人员提供的多功能工具，可以解决各种问题。

## 安装

要开始使用 Mate，需要安装 `@telegram-apps/mate`
软件包。 开发人员可以在本地和全球范围内进行开发：

:::code-group

```bash [pnpm]
# 本地
pnpm i -D @telegram-apps/mate
# 全球
pnpm i -g @telegram-apps/mate
```

```bash [npm]
# 本地。
npm i -D @telegram-apps/mate
# 全球。
npm i -g @telegram-apps/mate
```

```bash [yarn]
# 本地。
yarn add -D @telegram-apps/mate
# 全局。
yarn global add @telegram-apps/mate
```

:::

安装后，可通过 `mate` CLI 工具访问该软件包：

```bash
mate --help
```

> [！提示]
> 强烈建议在本地安装软件包，以避免
> 对软件包版本的混淆，并确保
> 开发团队内部使用体验的一致性。

## 免安装使用

不安装软件包，也可以使用 `pnpm` 或 `npx`：

:::code-group

```bash [pnpm]
pnpm dlx @telegram-apps/mate@latest --help
```

```bash [npx]
npx @telegram-apps/mate@latest --help
```

:::
