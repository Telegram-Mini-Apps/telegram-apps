import {
  createPrompt,
  useState,
  isEnterKey,
  useEffect,
  useKeypress,
} from '@inquirer/core';
import { URL } from 'node:url';
import chalk from 'chalk';

import { theme } from '../theme.js';
import { usePromptPrefix } from '../utils/usePromptPrefix.js';
import { spaces } from '../utils/spaces.js';
import { lines } from '../utils/lines.js';
import { useInputPrefix } from '../utils/useInputPrefix.js';

/**
 * Checks if passed value is correct. Returns error text.
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

  // Check if it is SSH connection string.
  if (value.match(/\w+@[\w\-.]+:[\w-]+\/[\w./]+/)) {
    return;
  }
  return 'Value is not considered as URL link or SSH connection string.';
}

export const promptGitRepo = createPrompt<string, {}>((_, done) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [completed, setCompleted] = useState(false);

  function confirm(value: string): void {
    setValue(value);
    setError(undefined);
    setCompleted(true);
    done(value);
  }

  useEffect(() => {
    if (completed) {
      done(value);
    }
  }, [completed, done, value]);

  useKeypress((key, rl) => {
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
      usePromptPrefix(completed),
      theme.style.message('Git remote repository URL:'),
      useInputPrefix(completed),
      completed
        ? theme.style.answer(value ? value : chalk.italic('not specified'))
        : value,
    ),
    lines(
      error ? theme.style.error(error) : undefined,
      !completed && theme.style.help(
        lines(
          'This value will be used to connect created project with your remote Git repository. It should either be an HTTPS link or SSH connection string.',
          `Leave value empty and press ${theme.style.key('enter')} to skip this step.`,
          chalk.bold('Examples'),
          'SSH: git@github.com:user/repo.git',
          'URL: https://github.com/user/repo.git',
        ),
      ),
    ),
  ];
});