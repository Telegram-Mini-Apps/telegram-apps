import { spawn } from 'node:child_process';

import chalk from 'chalk';
import ora from 'ora';

import { theme } from './theme.js';

interface Options {
  /**
   * Shell command to run.
   */
  command: string | (() => Promise<any>);
  /**
   * Spinner title.
   */
  title: string;
  /**
   * Text displayed when process completed successfully.
   */
  titleSuccess?: string;
  /**
   * Text displayed when process failed.
   */
  titleFail?: string | ((outputOrCode: string | number) => string);
}

function formatError(e: unknown): string {
  return e instanceof Error
    ? e.message
    : typeof e === 'string'
      ? e
      : JSON.stringify(e);
}

/**
 * Spawns new process with spinner.
 * @param options - function options.
 */
export function spawnWithSpinner({
  command,
  title,
  titleFail,
  titleSuccess,
}: Options): Promise<void> {
  const { style } = theme;
  const spinner = ora({
    text: style.message(title),
    hideCursor: false,
  }).start();

  const success = titleSuccess && style.message(titleSuccess);

  if (typeof command === 'function') {
    return command()
      .then(() => {
        spinner.succeed(success);
      })
      .catch((e) => {
        const errString = formatError(e);
        spinner.fail(
          style.error(
            titleFail
              ? typeof titleFail === 'string'
                ? titleFail
                : titleFail(errString)
              : errString,
          ),
        );

        throw e;
      });
  }

  return new Promise((res, rej) => {
    const proc = spawn(command, { shell: true });

    // Buffer which contains error data.
    let errBuf = Buffer.from([]);

    // When something was received from the error channel, we append it to the final buffer.
    proc.stderr.on('data', (buf) => {
      errBuf = Buffer.concat([errBuf, buf]);

      // Update the spinner text to let user know, process is working.
      spinner.suffixText = chalk.bgGray(chalk.italic(buf.toString()));
    });

    proc.on('exit', (code) => {
      // Drop process outputs.
      spinner.suffixText = '';

      // If error code was not returned. It means, process completed successfully.
      if (!code) {
        spinner.succeed(success);
        res();
        return;
      }

      const errString = errBuf.length ? errBuf.toString() : `Action error code: ${code}`;
      const errorMessage = style.error(
        titleFail
          ? typeof titleFail === 'string'
            ? titleFail
            : titleFail(errString)
          : errString,
      );

      spinner.fail(errorMessage);
      rej(new Error(errorMessage));
    });
  });
}
