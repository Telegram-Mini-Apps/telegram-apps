import {
  createPrompt,
  useState,
  isEnterKey,
  useEffect,
  useKeypress,
} from '@inquirer/core';
import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import figures from 'figures';

import { theme } from '../theme.js';
import { usePrefix } from '../usePrefix.js';
import { spaces } from '../utils/spaces.js';

/**
 * Checks if passed value is value. Returns error text.
 * @param value - value to validate.
 */
function validate(value: string): string | undefined {
  if (value.length === 0) {
    return 'Directory name should not be empty.';
  }

  const dir = resolve(value);
  if (existsSync(dir)) {
    return `Directory already exists: ${dir}`;
  }

  if (value !== basename(value)) {
    return `Value "${value}" contains invalid symbols.`;
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
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
      if (confirmed) {
        done(value);
      }
    }, [confirmed, done, value]);

    function confirm(value: string): void {
      setValue(value);
      setError(undefined);
      setConfirmed(true);
      done(value);
    }

    useKeypress((key, rl) => {
      if (confirmed) {
        return;
      }

      if (isEnterKey(key)) {
        if (!value) {
          return defaultValue
            ? confirm(defaultValue)
            : setError('You have to specify the directory.');
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

    const { style } = theme;

    return [
      spaces(
        usePrefix(confirmed ? 'completed' : 'pending'),
        style.message('Directory name:'),
        style.muted(figures.pointerSmall),
        confirmed
          ? style.answer(value)
          : value || (defaultValue ? style.muted(defaultValue) : ''),
      ),
      error && style.error(error),
    ];
  },
);