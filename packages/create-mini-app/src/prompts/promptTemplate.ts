import {
  createPrompt,
  isDownKey,
  isEnterKey,
  isSpaceKey,
  isUpKey,
  Separator,
  useKeypress,
  useMemo,
  useState,
} from '@inquirer/core';
import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import figures from 'figures';

import { lines } from '../utils/lines.js';
import { usePrefix } from '../usePrefix.js';
import { findTemplate } from '../templates.js';
import { theme } from '../theme.js';
import { spaces } from '../utils/spaces.js';
import type { AnyTemplate, Framework, Language, SDK } from '../types.js';

interface CreateSection<N, V> {
  title: string;
  name: N;
  choices: Choice<V>[];
}

interface SelectedChoices {
  framework: Framework;
  sdk: SDK;
  language: Language;
}

interface Choice<V> {
  title: string;
  value: V;
  defaultChecked?: boolean;
}

type Section =
  | CreateSection<'framework', Framework>
  | CreateSection<'sdk', SDK>
  | CreateSection<'language', Language>;

const { bold, green, blue } = chalk;

export const promptTemplate = createPrompt<AnyTemplate, {}>(
  (_, done) => {
    // List of all sections to be displayed.
    const sections = useMemo<Section[]>(() => [
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
    ], []);

    const {
      selected: selectedInitially,
      choices,
    } = useMemo(() => {
      const result = {
        selected: {} as SelectedChoices,
        choices: [] as Choice<Framework | Language | SDK>[],
      };

      sections.forEach((section) => {
        result.choices.push(...section.choices);

        section.choices.forEach((item) => {
          if (item.defaultChecked) {
            (result.selected as any)[section.name] = item.value;
          }
        });
      });

      return result;
    }, []);

    // Hashmap of selected items.
    const [selected, setSelected] = useState(selectedInitially);

    // Currently selected item index.
    const [active, setActive] = useState(0);

    // Prompt result.
    const [isDone, setIsDone] = useState(false);

    const prefix = usePrefix('pending');

    // Currently selected template.
    const template = useMemo<AnyTemplate | undefined>(() => {
      return findTemplate(selected.language, selected.sdk, selected.framework);
    }, [selected]);

    useKeypress((key) => {
      // Space bar changes current selection.
      if (isSpaceKey(key)) {
        const choice = choices[active];
        const choiceSection = sections.find((section) => {
          return section.choices.some((sectionChoice) => sectionChoice === choice);
        })!;
        setSelected({ ...selected, [choiceSection.name]: choice.value });
      }

      // Key Up selects the previous element.
      if (isUpKey(key)) {
        setActive(active === 0 ? choices.length - 1 : active - 1);
        return;
      }

      // Key Down selects the next element.
      if (isDownKey(key)) {
        setActive(active === choices.length - 1 ? 0 : active + 1);
      }

      // Key Enter confirms selection.
      if (isEnterKey(key)) {
        if (template) {
          done(template);
          setIsDone(true);
        }
      }
    });

    const { style } = theme;

    if (isDone) {
      const lang = { js: 'JavaScript', ts: 'TypeScript' }[template!.language];
      const sdk = { telegram: 'Telegram SDK', 'tma.js': '@tma.js' }[template!.sdk];
      const framework = {
        'react.js': 'React.js',
        'solid.js': 'Next.js',
        'next.js': 'Solid.js',
      }[template!.framework];

      return spaces(
        usePrefix('completed'),
        style.message('Project technologies:'),
        `${bold(blue(framework))}, ${bold(blue(lang))} and ${bold(blue(sdk))}`,
      );
    }

    return `${
      lines(
        // Message.
        spaces(prefix, style.message(
          'Please, select preferred technologies to scaffold your application.',
        )),

        // Selections table.
        sections.map((section) => lines(
          bold(section.title),
          section.choices.map((choice) => {
            const icon = selected[section.name] === choice.value
              ? green(figures.radioOn)
              : figures.radioOff;
            const cursor = choices.indexOf(choice) === active ? figures.pointer : ' ';

            return `${cursor} ${icon} ${choice.title}`;
          }),
        )),

        new Separator().separator,

        // Help tip.
        style.help(`(${[
          `${style.key('space')} to select`,
          `${style.key(figures.arrowUp)} and ${style.key(figures.arrowDown)} to change cursor`,
        ].join(', ')})`),

        template
          ? style.success(
            `A template utilizing these technologies was discovered. Press ${style.key('enter')} to proceed.`,
          )
          : style.error('Currently, no template exists that uses these technologies.'),
      )}${ansiEscapes.cursorHide}`;
  },
);
