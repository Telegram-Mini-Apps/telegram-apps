export interface TemplateRepository {
  clone: {
    https: string;
    ssh: string;
  };
  link: string;
}

export interface AnyTemplate {
  sdk: SDK;
  language: Language;
  framework: Framework;
  repository: TemplateRepository;
}

export type Language = 'js' | 'ts';
export type SDK = 'telegram' | 'tma.js';
export type Framework = 'solid.js' | 'react.js' | 'next.js';
