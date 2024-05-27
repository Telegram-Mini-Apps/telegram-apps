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
    'tma.js': {
      'react.js': 'reactjs-js-template',
      'solid.js': 'solidjs-js-template',
    },
  },
  ts: {
    'tma.js': {
      'react.js': 'reactjs-template',
      'solid.js': 'solidjs-template',
      'next.js': 'nextjs-template',
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
