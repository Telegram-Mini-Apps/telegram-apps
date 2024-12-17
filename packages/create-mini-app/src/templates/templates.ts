import type { Template, Framework, Language, SDK } from './types.js';

function jsRepo(name: string) {
  return {
    repository: name,
    deprecationReason: 'JavaScript templates are not supported and most likely to be outdated. To use more actual template, consider using TypeScript alternatives.',
  };
}

function jQueryRepo(name: string) {
  return {
    repository: name,
    deprecationReason: 'jQuery template is not supported and most likely to be outdated. To use more actual template, consider using other technologies.',
  };
}

function pureRepo(name: string) {
  return {
    repository: name,
    deprecationReason: 'Pure JavaScript and TypeScript templates are not supported and most likely to be outdated. To use more actual template, consider using other technologies.',
  };
}

const templates: {
  [lang in Language]?: {
    [sdk in SDK]?: {
      [framework in Framework]?: string | {
      repository: string;
      deprecationReason?: string;
    };
    };
  };
} = {
  js: {
    telegramApps: {
      react: jsRepo('reactjs-js-template'),
      solid: jsRepo('solidjs-js-template'),
      next: jsRepo('nextjs-js-template'),
      jquery: jQueryRepo('js-template'),
      none: pureRepo('vanillajs-template'),
    },
    tsdk: {
      react: jsRepo('reactjs-js-tsdk-template'),
      solid: jsRepo('solidjs-js-tsdk-template'),
      next: jsRepo('nextjs-js-tsdk-template'),
      jquery: jQueryRepo('js-tsdk-template'),
      none: pureRepo('vanillajs-tsdk-template'),
    },
  },
  ts: {
    telegramApps: {
      react: 'reactjs-template',
      solid: 'solidjs-template',
      next: 'nextjs-template',
      jquery: jQueryRepo('typescript-template'),
      vue: 'vuejs-template',
    },
    tsdk: {
      react: 'reactjs-tsdk-template',
      solid: 'solidjs-tsdk-template',
      next: 'nextjs-tsdk-template',
      jquery: jQueryRepo('typescript-tsdk-template'),
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
  if (!repo) {
    return;
  }
  const repoName = typeof repo === 'string' ? repo : repo.repository;
  const deprecationReason = typeof repo === 'string' ? undefined : repo.deprecationReason;

  return {
    sdk,
    language,
    framework,
    deprecationReason,
    repository: {
      clone: {
        https: `https://github.com/Telegram-Mini-Apps/${repoName}.git`,
        ssh: `git@github.com:Telegram-Mini-Apps/${repoName}.git`,
      },
      link: `github.com/Telegram-Mini-Apps/${repoName}`,
    },
  };
}
