# Contribution Guidelines

Contributing to the development of the libraries related to the Telegram Web Apps platform is not difficult. We have a limited set of TypeScript packages and a bunch of scripts that will be useful during development.

Before starting to contribute, it is better to discuss any proposed changes with the project owners in order to avoid duplication of effort. If you would still like to contribute, here is a short guide on how to do it:

1. Fork this repository.
2. Make the changes you would like to see in the packages.
3. Write tests related to the changes.
4. Check if everything is working fine using the prepared scripts:
   - Try building all packages: `pnpm run packages:build`
   - Test the code: `pnpm run packages:test`
   - Format the code: `pnpm run packages:lint`
5. Describe your changes using the `changeset` command. This will start an interactive changes description.
6. Create a pull request and describe everything you have done.
7. Wait for the project owners to review your pull request.
