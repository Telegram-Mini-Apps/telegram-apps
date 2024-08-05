import type { Template, Framework, Language, SDK, TemplateRepository } from './types.js';

function createRepository(name: string): TemplateRepository {
  return {
    clone: {
      https: `https://github.com/Telegram-Mini-Apps/${name}.git`,
      ssh: `git@github.com:Telegram-Mini-Apps/${name}.git`,
    },
    link: `github.com/Telegram-Mini-Apps/${name}`,
  };
}

const settings = {
  js: {
    telegramApps: {
      react: 'reactjs-js-template',
      solid: 'solidjs-js-template',
      next: 'nextjs-js-template',
      jquery: 'js-template',
      none: 'vanillajs-template',
    },
    tsdk: {
      react: 'reactjs-js-tsdk-template',
      solid: 'solidjs-js-tsdk-template',
      next: 'nextjs-js-tsdk-template',
      jquery: 'js-tsdk-template',
      none: 'vanillajs-tsdk-template',
    },
  },
  ts: {
    telegramApps: {
      react: 'reactjs-template',
      solid: 'solidjs-template',
      next: 'nextjs-template',
      jquery: 'typescript-template',
    },
    tsdk: {
      react: 'reactjs-tsdk-template',
      solid: 'solidjs-tsdk-template',
      next: 'nextjs-tsdk-template',
      jquery: 'typescript-tsdk-template',
    },
  },
} as const;

/**
 * A list of the templates known to the CLI.
 */
const templates: Template[] = [];

for (const language in settings) {
  const languageSettings = settings[language as keyof typeof settings];

  for (const sdk in languageSettings) {
    const frameworkSettings = languageSettings[sdk as keyof typeof languageSettings];

    for (const framework in frameworkSettings) {
      templates.push({
        framework: framework as Framework,
        sdk: sdk as SDK,
        language: language as Language,
        repository: createRepository(frameworkSettings[framework as keyof typeof frameworkSettings]),
      });
    }
  }
}

/**
 * Leaves only templates with specified technologies.
 * @param language
 * @param sdk
 * @param framework
 */
export function findTemplate(
  language: Language,
  sdk: SDK,
  framework: Framework,
): Template | undefined {
  return templates.find((t) => (
    t.sdk === sdk
    && t.language === language
    && t.framework === framework
  ));
}
