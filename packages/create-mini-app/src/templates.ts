interface CreateTemplate<Language extends string, Framework extends string> {
  sdk: 'telegram' | 'tma.js';
  language: Language;
  framework: Framework;
  repository: TemplateRepository;
}

export interface TemplateRepository {
  clone: {
    https: string;
    ssh: string;
  };
  link: string;
}

type JsTemplate = CreateTemplate<'js', 'solid.js' | 'react.js' | 'next.js' | 'vanilla js'>;
type TsTemplate = CreateTemplate<'ts', 'solid.js' | 'react.js' | 'next.js'>;
export type AnyTemplate = JsTemplate | TsTemplate;

type AllowedLanguage = AnyTemplate['language'];
type AllowedSDK = AnyTemplate['sdk'];
type AllowedFramework = AnyTemplate['framework'];

/**
 * List of templates known to the CLI.
 */
export const templates: AnyTemplate[] = [{
  language: 'ts',
  sdk: 'tma.js',
  framework: 'react.js',
  repository: {
    clone: {
      https: 'https://github.com/Telegram-Mini-Apps/reactjs-template.git',
      ssh: 'git@github.com:Telegram-Mini-Apps/reactjs-template.git',
    },
    link: 'github.com/Telegram-Mini-Apps/reactjs-template',
  },
}];

export function filterTemplates(
  language: AllowedLanguage,
  sdk: AllowedSDK,
  framework: AllowedFramework,
): AnyTemplate[] {
  return templates.filter((t) => {
    return t.sdk === sdk && t.language === language && t.framework === framework;
  });
}
