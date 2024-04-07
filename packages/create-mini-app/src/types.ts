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

type JsTemplate = CreateTemplate<'js', 'solid.js' | 'react.js' | 'next.js'>;
type TsTemplate = CreateTemplate<'ts', 'solid.js' | 'react.js' | 'next.js'>;
export type AnyTemplate = JsTemplate | TsTemplate;

export type KnownLanguage = AnyTemplate['language'];
export type KnownSDK = AnyTemplate['sdk'];
export type KnownFramework = AnyTemplate['framework'];
