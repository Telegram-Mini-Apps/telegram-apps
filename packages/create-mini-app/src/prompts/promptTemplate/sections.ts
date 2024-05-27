import { Section } from './types.js';
import { Framework, Language, SDK } from '../../types.js';

export const sections: Section[] = [
  {
    title: 'Language',
    name: 'language',
    choices: [
      { title: 'TypeScript', value: 'ts', defaultChecked: true },
      { title: 'JavaScript', value: 'js' },
    ],
  },
  {
    title: 'SDK',
    name: 'sdk',
    choices: [
      { title: 'tma.js', value: 'tma.js', defaultChecked: true },
      { title: 'Telegram SDK', value: 'telegram' },
    ],
  },
  {
    title: 'Framework',
    name: 'framework',
    choices: [
      { title: 'React.js', value: 'react.js', defaultChecked: true },
      { title: 'Solid.js', value: 'solid.js' },
      { title: 'Next.js', value: 'next.js' },
    ],
  },
];

export function findTitleByNameAndValue(name: 'language', value: Language): string | undefined;
export function findTitleByNameAndValue(name: 'framework', value: Framework): string | undefined;
export function findTitleByNameAndValue(name: 'sdk', value: SDK): string | undefined;
export function findTitleByNameAndValue(
  name: 'language' | 'framework' | 'sdk',
  value: string,
): string | undefined {
  return sections
    .find(s => s.name === name)
    ?.choices
    .find(c => c.value === value)
    ?.title;
}
