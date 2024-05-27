import type { Framework, Language, SDK } from '../../types.js';

interface CreateSection<N, V> {
  title: string;
  name: N;
  choices: Choice<V>[];
}

export interface Choice<V> {
  title: string;
  value: V;
  defaultChecked?: boolean;
}

export type Section =
  | CreateSection<'framework', Framework>
  | CreateSection<'sdk', SDK>
  | CreateSection<'language', Language>;

export interface Cell {
  title: string;
  length: number;
}

export interface SelectedChoices {
  framework: Framework;
  sdk: SDK;
  language: Language;
}