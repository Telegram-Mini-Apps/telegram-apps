import type { Theme } from '@inquirer/core';

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
export type Framework = 'solid' | 'react' | 'next' | 'jquery' | 'vue' | 'none';

export type CustomTheme = Theme<{
  style: {
    error(text: string): string;
    success(text: string): string;
    placeholder(text: string): string;
  }
}>;