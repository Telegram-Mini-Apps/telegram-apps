# @telegram-apps/create-mini-app

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@telegram-apps/create-mini-app">
    <img src="https://img.shields.io/npm/v/@telegram-apps/create-mini-app?logo=npm"/>
  </a>
  <a href="https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/create-mini-app">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

`@telegram-apps/create-mini-app` 是一个 CLI 工具，用于在 Telegram 迷你应用程序平台上构建新的迷你应用程序。

## 使用方法

要运行该工具，请根据软件包管理器使用以下脚本之一。

::: code-group
```bash [pnpm]
pnpm dlx @telegram-apps/create-mini-app@latest
```

```bash [npm]
npx @telegram-apps/create-mini-app@latest
```

```bash [yarn]
yarn create @telegram-apps/mini-app
```
:::

## 创建一个新的应用程序

上述命令将执行一个脚本，该脚本将引导您创建应用程序，并按顺序提示您输入以下信息
创建应用程序：

### 1. 项目目录名称

- **提示**： 输入项目文件所在文件夹的名称。

- **默认**：mini-app
     脚本将在当前目录下创建一个指定名称的子文件夹。

### 2.	首选技术

| 选项         | 详情                                                                                                                                                                                                                                                                                                                                 |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Language**   | 选择 **TypeScript** 或 **JavaScript**。                                                                                                                                                                                                                                                                                        |
| **SDK**        | **• tma.js** [@telegram-apps/sdk](https://www.npmjs.com/package/@telegram-apps/sdk) <br/> 一个用于与 Telegram 小程序功能无缝通信的 TypeScript 库。<br/> **• Telegram SDK** [@twa-dev/sdk](https://www.npmjs.com/package/@twa-dev/sdk) <br/> 该包允许你以 npm 包的形式使用 Telegram SDK。  |
| **Frameworks** | **• React.js** [template](https://github.com/Telegram-Mini-Apps/reactjs-template)<br/> **• Next.js** [template](https://github.com/Telegram-Mini-Apps/nextjs-template)<br/> **• Solid.js** [template](https://github.com/Telegram-Mini-Apps/solidjs-js-template)<br/>                                                                   |

### 3.	Git 远程仓库 URL（可选）

输入 Git 远程仓库 URL。该值将用于将创建的项目与您的
远程 Git 仓库。它应该是 HTTPS 链接或 SSH 连接字符串。

##构建配置

使用 `create-mini-app` 创建的项目被配置为使用 [Vite](https://vite.dev/) 捆绑程序。项目包含一个 `vite.config.js` 文件、
文件，您可以根据需要自定义调整构建设置。
