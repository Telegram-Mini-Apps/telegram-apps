import {
  createPrompt,
  useState,
  isEnterKey,
  useEffect,
  useKeypress,
} from '@inquirer/core';
import { existsSync } from 'node:fs';

import { theme } from '../theme.js';
import { usePromptPrefix } from '../utils/usePromptPrefix.js';
import { spaces } from '../utils/spaces.js';
import { useInputPrefix } from '../utils/useInputPrefix.js';
import { lines } from '../utils/lines.js';
import { resolve } from 'node:path';

/**
 * Checks if passed value is correct. Returns error text.
 * @param value - value to validate.
 */
function validate(value: string): string | undefined {
  if (value.length === 0) {
    return 'Directory name should not be empty.';
  }

  if (['.', '..'].includes(value)) {
    return 'Value is not valid directory name.';
  }

  if (!value.match(/^[a-zA-Z0-9\-.]+$/)) {
    return 'Value contains invalid symbols.';
  }

  if (existsSync(resolve(value))) {
    return `Directory "${value}" already exists`;
  }
}

interface Config {
  /**
   * Value to be selected in case, user did not enter anything.
   */
  defaultValue?: string;
}

export const promptDirName = createPrompt<string, Config>(
  ({ defaultValue }, done) => {
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
      if (completed) {
        return;
      }

      if (isEnterKey(key)) {
        if (!value) {
          const err = defaultValue && validate(defaultValue);
          if (err) {
            return setError(err);
          }

          return defaultValue
            ? confirm(defaultValue)
            : setError('You have to specify the directory.');
        }
        if (error) {
          // We are doing it twice, as long as after pressing the enter button, we will have
          // 2 lines.
          rl.clearLine(0);
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
        theme.style.message('Directory name:'),
        useInputPrefix(completed),
        completed
          ? theme.style.answer(value)
          : value || (defaultValue ? theme.style.muted(defaultValue) : ''),
      ),
      completed ? undefined : lines(
        theme.style.help('This directory will be used as a root directory for the project. It is allowed to use alphanumeric latin letters, dashes and dots.'),
        error ? theme.style.error(error) : undefined,
      ),
    ];
  },
);