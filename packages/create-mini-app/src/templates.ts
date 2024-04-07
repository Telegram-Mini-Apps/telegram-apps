import type {
  AnyTemplate,
  KnownFramework,
  KnownLanguage,
  KnownSDK,
  TemplateRepository,
} from './types.js';

function createRepository(name: string): TemplateRepository {
  return {
    clone: {
      https: `https://github.com/Telegram-Mini-Apps/${name}.git`,
      ssh: `git@github.com:Telegram-Mini-Apps/${name}.git`,
    },
    link: `github.com/Telegram-Mini-Apps/${name}`,
  };
}

/**
 * List of templates known to the CLI.
 */
export const templates: AnyTemplate[] = [{
  language: 'ts',
  sdk: 'tma.js',
  framework: 'react.js',
  repository: createRepository('reactjs-template'),
}, {
  language: 'js',
  sdk: 'tma.js',
  framework: 'react.js',
  repository: createRepository('reactjs-js-template'),
}];

/**
 * Leaves only templates with specified technologies.
 * @param language
 * @param sdk
 * @param framework
 */
export function findTemplate(
  language: KnownLanguage,
  sdk: KnownSDK,
  framework: KnownFramework,
): AnyTemplate | undefined {
  return templates.find((t) => {
    return t.sdk === sdk && t.language === language && t.framework === framework;
  });
}
