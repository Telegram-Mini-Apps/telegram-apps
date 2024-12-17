import type { Template, Framework, Language, SDK } from './types.js';

const templates: {
  [lang in Language]?: {
    [sdk in SDK]?: {
      [framework in Framework]?: string;
    };
  };
} = {
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
      vue: 'vuejs-template',
    },
    tsdk: {
      react: 'reactjs-tsdk-template',
      solid: 'solidjs-tsdk-template',
      next: 'nextjs-tsdk-template',
      jquery: 'typescript-tsdk-template',
    },
  },
};

/**
 * Leaves only templates with specified technologies.
 * @param language - programming language.
 * @param sdk - SDK to use as the base one.
 * @param framework - target framework.
 */
export function findTemplate(
  language: Language,
  sdk: SDK,
  framework: Framework,
): Template | undefined {
  const repo = templates[language]?.[sdk]?.[framework];
  return repo ? {
    sdk,
    language,
    framework,
    repository: {
      clone: {
        https: `https://github.com/Telegram-Mini-Apps/${repo}.git`,
        ssh: `git@github.com:Telegram-Mini-Apps/${repo}.git`,
      },
      link: `github.com/Telegram-Mini-Apps/${repo}`,
    },
  } : undefined;
}
