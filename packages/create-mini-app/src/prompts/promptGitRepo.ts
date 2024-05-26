import {
  createPrompt,
  useState,
  isEnterKey,
  useEffect,
  useKeypress,
  Separator,
} from '@inquirer/core';
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { URL } from 'node:url';
import figures from 'figures';
import chalk from 'chalk';

import { theme } from '../theme.js';
import { usePrefix } from '../usePrefix.js';
import { toAbsolute } from '../toAbsolute.js';
import { spaces } from '../utils/spaces.js';
import { lines } from '../utils/lines.js';

/**
 * Checks if passed value is value. Returns error text.
 * @param value - value to validate.
 */
function validate(value: string): string | undefined {
  if (value.length === 0) {
    return;
  }

  // Check if specified value is URL.
  try {
    new URL(value);
    return '';
  } catch {
  }


}

export const promptGitRepo = createPrompt<string, {}>((_, done) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);

  const { style } = theme;

  function confirm(value: string): void {
    setValue(value);
    setError(undefined);
    setConfirmed(true);
    done(value);
  }

  useEffect(() => {
    if (confirmed) {
      done(value);
    }
  }, [confirmed, done, value]);

  useKeypress((key, rl) => {
    if (confirmed) {
      return;
    }

    if (isEnterKey(key)) {
      if (!value) {
        return confirm('');
      }
      if (error) {
        rl.clearLine(0);
        rl.write(value);
      }
      return error ? undefined : confirm(value);
    }

    const input = rl.line;
    setError(input ? validate(input) : undefined);
    setValue(input);
  });

  return [
    spaces(
      usePrefix(confirmed ? 'completed' : 'pending'),
      style.message('Git remote repository URL:'),
      style.muted(figures.pointerSmall),
      confirmed ? style.answer(value) : value,
    ),
    style.help(
      lines(
        new Separator().separator,
        'This value will be used to connect with your remote Git repository. It should either be an HTTPS link or SSH connection string.',
        '',
        `Roughly, it will be used in the command:\n${chalk.italic('git remote add origin {value}')}`,
        new Separator().separator,
        chalk.bold('Examples'),
        'SSH: git@github.com:user/repo.git',
        'HTTPS: https://github.com/heyqbnk/abc.git',
        new Separator().separator,
        `Leave empty and press ${style.key('enter')} to skip.`,
      ),
    ),
  ];
});