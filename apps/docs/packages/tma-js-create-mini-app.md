# @tma.js/create-mini-app

<p style="display: inline-flex; gap: 8px">
  <a href="https://npmjs.com/package/@tma.js/create-mini-app">
    <img src="https://img.shields.io/npm/v/@tma.js/create-mini-app?logo=npm"/>
  </a>
  <a href="https://github.com/Telegram-Mini-Apps/tma.js/tree/master/packages/create-mini-app">
    <img src="https://img.shields.io/badge/source-black?logo=github"/>
  </a>
</p>

`@tma.js/create-mini-app` is a CLI tool designed to scaffold your new
mini application on the Telegram Mini Apps platform. It generates a project with pre-configured libraries and template
files,
allowing you to customize the content based on your specific requirements.

## Usage

To run the tool, use one of the following scripts depending on your package manager.

::: code-group

```bash [pnpm]
pnpm dlx @tma.js/create-mini-app@latest
```

```bash [npm]
npx @tma.js/create-mini-app@latest
```

```bash [yarn]
yarn create @tma.js/mini-app
```

:::

## Creating a New Application

The above command executes a script that guides you through the creation of
your application by sequentially prompting for the following information:

### 1. Project Directory Name

- **Prompt**: Enter the name of the folder where the project files will be located. The script will create a subfolder
  with the specified name in the current directory.

- **Default**: `mini-app`

### 2. Preferred Technologies

| Option         | Details                                                                                                                                                                                                                                                                                                                                                  |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Language**   | Choose between **TypeScript** or **JavaScript**.                                                                                                                                                                                                                                                                                                         |
| **SDK**        | **• tma.js** [@tma.js/sdk](https://www.npmjs.com/package/@tma.js/sdk) <br/>A TypeScript library for seamless communication with Telegram Mini Apps functionality. <br/> **• Telegram SDK** [telegram-web-app.js](https://telegram.org/js/telegram-web-app.js)<br/>This package allows you to work with the SDK as an npm package.                        |
| **Frameworks** | **• React.js** [template](https://github.com/Telegram-Mini-Apps/reactjs-template)<br/> **• Next.js** [template](https://github.com/Telegram-Mini-Apps/nextjs-template)<br/> **• Solid.js** [template](https://github.com/Telegram-Mini-Apps/solidjs-js-template)<br/> **• Vue.js** [template](https://github.com/Telegram-Mini-Apps/vuejs-template)<br/> |

### 3. Git Remote Repository URL (Optional)

Enter the Git remote repository URL. This value will be used to connect the created project with your
remote Git repository. It should be either an HTTPS link or an SSH connection string.

## Build Configuration

Projects created with `create-mini-app` are configured to use the [Vite](https://vite.dev/) bundler. The project
includes a `vite.config.js` file, which you can customize to adjust the build settings according to your needs.
