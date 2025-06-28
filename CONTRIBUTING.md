# Contribution Guidelines

Contributing to the development of libraries related to the Telegram Mini Apps platform is not
difficult. We have a limited set of TypeScript packages and a bunch of scripts that will be useful
during development. Before starting to contribute, it is better to discuss any proposed changes with
the project owners via repository issues to avoid duplication of effort.

## Cloning Repository

First of all, it is required to fetch the repository code (or its forked version). To do this, you
can clone the repository using the Git command:

```bash
# Via SSH.
git clone git@github.com:Telegram-Mini-Apps/telegram-apps.git
```

or

```bash
# Via HTTPS.
git clone https://github.com/Telegram-Mini-Apps/telegram-apps.git
```

Once the repository is fetched, install project dependencies via [pnpm](https://pnpm.io/) (pnpm
only, as long as the current repository is a pnpm monorepo):

```bash
pnpm i
```

## Trying Your Code

This project contains an already configured application that can use any `@telegram-apps` package located
in the [packages](packages) folder. The application uses local versions of packages, not remote ones
presented in some registry. The local playground represents almost the default Vite TypeScript
application template with some additional tsconfig configuration, allowing the resolution of
packages from the corresponding folder.

To run the local playground, use the following commands:

```bash
# Build packages as long as the playground may 
# the built versions.
pnpm run packages:build

# Go to the application folder.
cd apps/local-playground

# Run Vite dev server.
pnpm run dev
```

This will make Vite start the development server using the `index.html` file placed in the
application directory. In turn, this HTML file refers to the `index.ts` file that will be
automatically transpiled by Vite and executed by the browser.

As the local playground refers to the actual code, you can make any changes in the packages
directory to see the changes instantly. This will help you understand how the code you are going to
change in `@telegram-apps` packages will work after your proposed changes.

## After Changes Done

When you are done with making changes, it is required to write tests related to the changes. For
this purpose, we use [Vitest](https://vitest.dev/). Then, we should check if the repository status
is correct.

Here is the list of commands you have to run:

```bash
# Run tests.
pnpm run packages:test

# Run eslint.
pnpm run packages:lint
# Or if you want to automatically fix problems:
pnpm run packages:lint:fix

# Check if packages are building successfully.
pnpm run packages:build
```

If all steps above were completed successfully and proposed changes require bumping some packages'
versions, you have to describe changes using the `changeset` command:

```bash
changeset
```

You can learn more about Changeset [here](.changeset/README.md).

When changes are described (if required), don't forget to create a Pull Request and wait for the
project owners to review it.