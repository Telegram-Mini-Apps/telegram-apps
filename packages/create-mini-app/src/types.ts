export interface TemplateRepository {
  clone: {
    https: string;
    ssh: string;
  };
  link: string;
}

export interface Template {
  sdk: SDK;
  language: Language;
  framework: Framework;
  repository: TemplateRepository;
}

export type Language = 'js' | 'ts';
export type SDK = 'tsdk' | 'telegramApps';
export type Framework = 'solid' | 'react' | 'next';
