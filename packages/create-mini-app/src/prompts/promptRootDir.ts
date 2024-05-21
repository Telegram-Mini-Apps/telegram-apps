import {
  createPrompt,
  useState,
  isEnterKey,
  useEffect,
  useKeypress,
} from '@inquirer/core';
import { existsSync } from 'node:fs';
import { basename } from 'node:path';

import { theme } from '../theme.js';
import { usePrefix } from '../usePrefix.js';
import { toAbsolute } from '../toAbsolute.js';
import { spaces } from '../utils/spaces.js';

/**
 * Checks if passed value is value. Returns error text.
 * @param value - value to validate.
 */
function validate(value: string): string | undefined {
  if (value.length === 0) {
    return 'Directory name should not be empty.';
  }

  const dir = toAbsolute(value);
  if (existsSync(dir)) {
    return `Directory already exists: ${dir}`;
  }

  if (value !== basename(value)) {
    return `Value "${value}" contains invalid symbols.`;
  }
}

export const promptRootDir = createPrompt<string, {}>((_, done) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);

  // When value was confirmed, notify external environment about result.
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
        return setError('You have to specify the directory name.');
      }
      return error ? undefined : setConfirmed(true);
    }

    setValue(rl.line);
  });

  // Whenever value changes, validate it.
  useEffect(rl => {
    if (!value) {
      return;
    }

    const err = validate(value);
    if (err) {
      rl.clearLine(0);
      rl.write(value);
    }
    setError(err);
  }, [value]);

  const { style } = theme;
  let secondLine: string | undefined;
  if (confirmed) {
    secondLine = spaces(usePrefix('info'), style.message('Selected path:'), style.answer(toAbsolute(value)));
  } else if (error) {
    secondLine = style.error(error);
  } else if (!value) {
    secondLine = style.help('Start typing to see the directory path');
  } else {
    secondLine = style.help(`Press ${style.key('enter')} to use the directory: ${toAbsolute(value)}`);
  }

  if (confirmed) {
    return spaces(
      usePrefix('completed'),
      style.message('Project directory:'),
      style.answer(toAbsolute(value)),
    );
  }

  return [
    spaces(
      usePrefix(confirmed ? 'completed' : 'pending'),
      style.message('Enter a directory name to initialize your application in:'),
      confirmed ? style.answer(value) : value,
    ),
    secondLine,
  ];
});