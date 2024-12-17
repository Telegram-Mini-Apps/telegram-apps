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

import { lines } from '../../utils/lines.js';
import { usePromptPrefix } from '../../utils/usePromptPrefix.js';
import { findTemplate } from '../../templates.js';
import { theme } from '../../theme.js';
import { spaces } from '../../utils/spaces.js';
import type { Template } from '../../types.js';

import { findTitleByNameAndValue, sections } from './sections.js';
import { Cell, SelectedChoices } from './types.js';
import { usePointer } from '../../utils/usePointer.js';

/* Table settings. */

const CORNER_TOP_LEFT = figures.lineDownBoldRightBold; // ┌
const CORNER_TOP_RIGHT = figures.lineDownBoldLeftBold; // ┐
const CORNER_BOTTOM_LEFT = figures.lineUpBoldRightBold; // └
const CORNER_BOTTOM_RIGHT = figures.lineUpBoldLeftBold; // ┘
const LINE_HOR_T_DOWN = figures.lineDownBoldLeftBoldRightBold; // ┬
const LINE_HOR_T_UP = figures.lineUpBoldLeftBoldRightBold; // ┬
const LINE_HOR = figures.lineBold; // ┃
const LINE_VER = figures.lineVerticalBold; // ━
const PADDING_HOR_LEFT = 1;
const PADDING_HOR_RIGHT = 3;

export const promptTemplate = createPrompt<Template, {}>(
  (_, done) => {
    // Selection coordinates.
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // Map of selected choices.
    const [selected, setSelected] = useState<SelectedChoices>(
      useMemo(() => {
        return sections.reduce<SelectedChoices>((acc, section) => {
          section.choices.forEach((item) => {
            if (item.defaultChecked) {
              (acc as any)[section.name] = item.value;
            }
          });

          return acc;
        }, {
          framework: 'react',
          sdk: 'telegramApps',
          language: 'ts',
        });
      }, []),
    );

    // True, if user confirmed his choice.
    const [completed, setCompleted] = useState(false);

    // Chosen template.
    const template = useMemo(() => {
      return findTemplate(selected.language, selected.sdk, selected.framework);
    }, [selected]);

    // Maximum Y user can reach.
    const maxY = useMemo(() => sections[x].choices.length - 1, [x]);

    // Each column widths along with generated rows data.
    const [lengths, rows] = useMemo(() => {
      const lengths = new Array<number>(sections.length).fill(0);
      const rows: Cell[][] = [[]];
      let maxChoicesCount = 0;

      sections.forEach((section, sIdx) => {
        // We add these 2 spaces on purpose, to align header with cells, containing additional
        // symbols before their title.
        const sectionTitle = `  ${section.title}`;

        // Re-compute maximums.
        lengths[sIdx] = Math.max(lengths[sIdx], sectionTitle.length);
        maxChoicesCount = Math.max(section.choices.length, maxChoicesCount);

        // Add title.
        rows[0].push({
          title: chalk.bold(sectionTitle),
          length: sectionTitle.length,
        });

        // Render all other rows.
        section.choices.forEach((choice, choiceIdx) => {
          const isActive = sIdx === x && choiceIdx === y;
          const isSelected = selected[section.name] === choice.value;
          const choiceLength = choice.title.length + 4;

          const pointer = isActive ? usePointer() : ' ';
          const cursor = isSelected
            ? template
              ? chalk.green(figures.radioOn)
              : chalk.red(figures.radioOn)
            : theme.style.muted(figures.radioOff);

          lengths[sIdx] = Math.max(lengths[sIdx], choiceLength);

          rows[choiceIdx + 1] ||= sections.map(() => ({ title: '', length: 0 }));
          rows[choiceIdx + 1][sIdx] = {
            title: spaces(
              pointer,
              cursor,
              isSelected ? chalk.bold(choice.title) : chalk.dim(choice.title),
            ),
            length: choiceLength,
          };
        });
      });

      return [lengths, rows];
    }, [x, y, selected]);

    // Horizontal lines for each column.
    const horizontalColumnLines = lengths.map(l => {
      return LINE_HOR.repeat(l + PADDING_HOR_LEFT + PADDING_HOR_RIGHT);
    });

    // Left and right cell paddings.
    const paddingLeft = ' '.repeat(PADDING_HOR_LEFT);
    const paddingRight = ' '.repeat(PADDING_HOR_RIGHT);

    const message = spaces(usePromptPrefix(completed), theme.style.message('Preferred technologies:', 'idle'));

    if (completed) {
      const lang = findTitleByNameAndValue('language', template!.language);
      const framework = findTitleByNameAndValue('framework', template!.framework);
      const sdk = findTitleByNameAndValue('sdk', template!.sdk);

      return spaces(
        // Message.
        message,

        // Selected technologies.
        `${chalk.bold.blue(framework)}, ${chalk.bold.blue(lang)} and ${chalk.bold.blue(sdk)}`,
      );
    }

    useKeypress((key) => {
      if (isSpaceKey(key)) {
        const section = sections[x];
        return setSelected({
          ...selected,
          [section.name]: section.choices[y].value,
        });
      }

      if (isEnterKey(key)) {
        if (template) {
          done(template);
          setCompleted(true);
        }
      }

      if (isUpKey(key)) {
        setY(y === 0 ? maxY : y - 1);
        return;
      }

      if (isDownKey(key)) {
        setY(y === maxY ? 0 : y + 1);
        return;
      }

      if (key.name === 'right') {
        const nextX = x === sections.length - 1 ? 0 : x + 1;
        const section = sections[nextX];
        if (y >= section.choices.length) {
          setY(section.choices.length - 1);
        }
        return setX(nextX);
      }

      if (key.name === 'left') {
        const nextX = x === 0 ? sections.length - 1 : x - 1;
        const section = sections[nextX];
        if (y >= section.choices.length) {
          setY(section.choices.length - 1);
        }
        return setX(nextX);
      }
    });

    return lines(
      // Message.
      message,

      // Upper border.
      [CORNER_TOP_LEFT, horizontalColumnLines.join(LINE_HOR_T_DOWN), CORNER_TOP_RIGHT].join(''),

      // Table body.
      rows.map(row => [
        // Cell left border.
        LINE_VER,
        paddingLeft,
        row
          .map((cell, columnIdx) => cell.title + ' '.repeat(lengths[columnIdx] - cell.length))
          .join(`${paddingRight}${LINE_VER}${paddingLeft}`),
        paddingRight,
        // Cell right border.
        LINE_VER,
      ].join('')),

      // Lower border.
      [CORNER_BOTTOM_LEFT, horizontalColumnLines.join(LINE_HOR_T_UP), CORNER_BOTTOM_RIGHT].join(''),

      // Help tip.
      // theme.style.help(
      [
        `${theme.style.key('space')} to select`,
        theme.style.key(figures.arrowUp),
        theme.style.key(figures.arrowDown),
        `${theme.style.key(figures.arrowLeft)} and ${theme.style.key(figures.arrowDown)} to change the cursor`,
      ].join(', '),
      // ),

      new Separator().separator,

      // Selection status.
      template
        ? theme.style.success(`A template using these technologies was discovered. Press ${theme.style.key('enter')} to proceed.`)
        : theme.style.error('Unable to find a template using these technologies'),

      theme.style.help(
        'According to selected technologies, the CLI tool will pick a corresponding template, which will be used as a base for your application.',
      ),

      ansiEscapes.cursorHide,
    );
  },
);
