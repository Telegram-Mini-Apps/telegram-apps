# @telegram-apps/mate

Mate is a multifunctional tool for developers at the Telegram Mini Apps 
platform, that solves a wide range of problems.

## Installing

To start using Mate, it is required to install the `@telegram-apps/mate`
package. The developer can do it both locally and globally: 

:::code-group

```bash [pnpm]
# Locally.
pnpm i -D @telegram-apps/mate
# Globally.
pnpm i -g @telegram-apps/mate
```

```bash [npm]
# Locally.
npm i -D @telegram-apps/mate
# Globally.
npm i -g @telegram-apps/mate
```

```bash [yarn]
# Locally.
yarn add -D @telegram-apps/mate
# Globally.
yarn global add @telegram-apps/mate
```

:::

Once installed, the package will be accessible via the `mate` CLI tool:

```bash
mate --help
```

> [!TIP]
> It is highly recommended to install the package locally to avoid confusion
> over package versions and to ensure a consistent usage experience within the
> development team.

## Install-free Usage

Not to install the package, you can also use the package using `pnpm` or `npx`:

:::code-group

```bash [pnpm]
pnpm dlx @telegram-apps/mate@latest --help
```

```bash [npx]
npx @telegram-apps/mate@latest --help
```

:::
