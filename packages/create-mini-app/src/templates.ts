interface CreateTemplate<Language extends string, Framework extends string> {
  sdk: 'telegram' | 'tma.js';
  language: Language;
  framework: Framework;
  repository: {
    clone: string;
    link: string;
  };
}

type JsTemplate = CreateTemplate<'js', 'solid' | 'react' | 'next' | 'vanilla js'>;
type TsTemplate = CreateTemplate<'ts', 'solid' | 'react' | 'next'>;
type AnyTemplate = JsTemplate | TsTemplate;

type AllowedLanguage = AnyTemplate['language'];
type AllowedSDK = AnyTemplate['sdk'];
type AllowedFramework = AnyTemplate['framework'];

export const templates: AnyTemplate[] = [{
  language: 'ts',
  sdk: 'tma.js',
  framework: 'react',
  repository: {
    clone: 'git@github.com:Telegram-Mini-Apps/reactjs-template.git',
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
