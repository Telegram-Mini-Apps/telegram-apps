---
outline: [2, 3]
---

# 托管

借助 Mate 快速可靠的托管服务，开发人员可以有效地管理其迷你应用程序的静态
资产。 高效、安全地交付静态文件
对实现最佳性能至关重要。

通过利用内容分发网络（CDN），Mate 的主机提高了
的可靠性，并加快了不同地区用户的文件加载速度，超越了单服务器解决方案的
性能。

托管服务是免费的，但在数据传输方面有一些限制。

> [!WARNING]
> 如果您目前使用单个服务器进行静态文件托管和
> 服务器端操作，过渡到 Mate 托管可能需要调整代码
> 。 如果您的应用程序已经区分了静态和动态
> 请求，那么集成工作就会简单得多。

## 特点

### 闪电速度

Mate 托管的重要特点是其配置完善的内容交付
网络遍布全球，分布在微型应用
常用的国家。 这一功能可让开发人员专注于构建他们的
应用程序，而不必担心如何尽快交付静态资产
。

### 版本管理系统

另一个值得注意的托管功能是版本管理系统。

Mate 允许创建多达五个部署标签，使开发人员能够
部署带有特定标签的项目，而不会影响先前部署的
资产。

#### 使用示例

常见的使用情况是项目有两个版本：`latest` 和
`staging`。 开发人员可以使用 `latest` 版本进行生产，而
`staging` 版本则供质量保证团队使用。

部署 `staging` 资产后，质量保证团队会检查暂存状态
是否可接受。 然后，同样的资产可以使用 `latest` 标签进行部署，用于
生产。

#### 关于Base URL

部署静态资产时，Mate 使用以下Base URL 模式：

```
https://{storage_key}.tapps.global/{tag}
```

下面是一些关于这些参数的信息，以供参考：

- `storage_key`：已部署项目的唯一密钥。 该值为
  ，不可配置，并在创建项目时分配给项目。
- `tag`：部署标记。 该值在部署过程中由
  开发人员设置。 例如，`staging`、`latest`、`dev` 等。

## 入门

### 步骤 1：注册项目

要开始使用托管功能，必须注册项目并
获取其部署令牌。 要获取令牌，请访问
到 [@tma_mate_bot](https://t.me/tma_mate_bot)，然后按 `Start` 按钮，
开始与机器人对话。

<p align="center">
  <img src="/mate/start.png" width="320"/>
</p>

然后，按下 `Create a Project` 按钮，并按照指定规则输入要创建的项目名称
。

<p align="center">
  <img src="/mate/create.png" width="320"/>
</p>

完成这一步后，机器人将返回创建的项目信息，包括
**deployment token**。

### 第 2 步：更新静态资产 Base URL

部署项目前，确保所有静态资产都有一个有效的 Base URL。 您可以了解有关 Mate 如何生成静态资产 Base URL [此处](#about-base-url)的更多信息。

要使用特定标签检索项目部署信息，请使用
以下命令：

```bash
mate deploy info \
  --token {DEPLOYMENT_TOKEN} \
  --project {PROJECT_ID} \
  --tag {TAG}
```

这里，`DEPLOYMENT_TOKEN` 和 `PROJECT_ID` 值指的是从上一步收到的部署
标记和项目标识符。 `TAG` 是
部署版本标记名称。

输出示例

```
✔ Fetched deploy information for paper-planes (id 48) project
Project Title: paper-planes
Short title of the project
--------
Base Path (using tag "staging"): https://35f105bd6b.tapps.global/staging
This path will be used as a base path for the uploaded assets associated with this project. 
Consider using this value as a base path in your bundler. You can also use different tags using the --tag option.
--------
Allowed file extensions: html, css, js, cjs, mjs, png, jpg, jpeg, webp, ttf, woff, woff2, eot, json, ico
Files extensions that are allowed to be uploaded.
--------
Maximum size: 10485760 bytes
Maximum upload size.
--------
Maximum files count: 100
Maximum number of files a single upload can contain.
```

`https://35f105bd6b.tapps.global/staging` 是项目捆绑程序应
使用的 Base URL。

下面介绍如何使用 [Vite](https://vitejs.dev)。

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: 'https://35f105bd6b.tapps.global/staging'
});
```

### 步骤 3：部署项目

要部署项目，Mate 需要指定一个要上传到
托管服务的文件夹。 该文件夹必须只包含
用户浏览器可以打开的文件，因此
目录中不应有源文件或用于不同目的的文件。

假设条件如下

- 已创建 ID 为 `48` 和令牌为 `aabbccdd` 的项目。
- 名为 `dist` 的文件夹包含迷你应用程序构建的所有静态资产。
- 部署静态资产时需要使用标签 `latest`。

要在这些条件下部署项目，请运行以下命令：

```bash
mate deploy upload \
  --dir dist \
  --token aabbccdd \
  --project 48 \
  --tag latest
```

以下是可能的输出结果：

```
✔ Fetched deploy information for paper-planes (id 48) project
i Assets base path (using tag "latest"): 
https://35f105bd6b.tapps.global/latest
i Allowed file extensions: html, css, js, cjs, mjs, png, jpg, jpeg, webp, ttf, woff, woff2, eot, json, ico
i Maximum upload size: 10485760 bytes
i Maximum files count: 100
✔ Directory compressed successfully from 24185 to 7168 bytes
✔ Archive uploaded successfully
📁 dist
╰ 📄 index.js (https://35f105bd6b.tapps.global/latest/index.js)
```

> [!WARNING]
> 部署的目录必须只包括标准文件和目录，
> 不包括私有文件和目录（以`.`符号开头）。 禁止所有其他类型的
> 文件（如符号链接）。 如果在部署过程中发现，
> CLI 工具将抛出相应的错误。

## 使用配置

为避免重复指定参数，Mate 允许创建包含所有参数的特殊配置。

要开始使用 Mate 配置和可选命令选项，请在项目根目录下创建包含以下示例内容的 `mate.yml` 或 `mate.json` 文件：

:::code-group

```yml [mate.yml]
deploy:
  projectId: 48
  directory: dist
  token: aabbccdd
  tag: latest
```

```json [mate.json]
{
  "deploy": {
    "projectId": 48,
    "directory": "dist",
    "token": "aabbccdd",
    "tag": "latest"
  }
}
```

:::

然后，`info` 和 `upload` 命令将从配置中获取值。

```bash
# Both of these commands will use the following 
# options from the Mate config:
# --project = 48
# --dir "dist"
# --token "aabbccdd"
# --tag "latest"
mate deploy info
mate deploy upload
```

如果需要覆盖任何参数，应在命令中指定。
例如，若要用 `staging` 值覆盖 `tag` 选项，请使用
以下命令：

```bash
mate deploy info --tag staging
```
