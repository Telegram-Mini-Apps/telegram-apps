import { spawn } from 'node:child_process';

import chalk from 'chalk';
import ora from 'ora';

interface SharedOptions {
  /**
   * A spinner title.
   */
  title: string;
  /**
   * A text to be displayed when the process has failed.
   */
  titleFail?: string | ((error: string) => string);
  /**
   * Count of spaces before the CLI line.
   */
  indent?: number;
}

interface TerminalOptions extends SharedOptions {
  /**
   * A shell command to run.
   */
  command: string;
  /**
   * A text to be displayed when the process completed successfully.
   */
  titleSuccess?: string;
}

interface OperationOptions<T> extends SharedOptions {
  /**
   * Action to execute.
   */
  command: () => Promise<T>;
  /**
   * A text to be displayed when the process completed successfully.
   */
  titleSuccess?: string | ((result: T) => string);
}

function formatError(e: unknown): string {
  return e instanceof Error
    ? e.message
    : typeof e === 'string'
      ? e
      : JSON.stringify(e);
}

export function spawnWithSpinner(options: TerminalOptions): Promise<void>;

export function spawnWithSpinner<T>(options: OperationOptions<T>): Promise<T>;

/**
 * Spawns a new process with a spinner.
 * @param options - function options.
 */
export function spawnWithSpinner({
  command,
  title,
  titleFail,
  titleSuccess,
  indent
}: TerminalOptions | OperationOptions<any>): Promise<any> {
  const spinner = ora({ text: title, hideCursor: false, indent }).start();

  if (typeof command === 'function') {
    return command()
      .then((result) => {
        spinner.succeed(
          typeof titleSuccess === 'function'
            ? titleSuccess(result)
            : titleSuccess,
        );

        return result;
      })
      .catch((e) => {
        const errString = formatError(e);
        spinner.fail(
          titleFail
            ? typeof titleFail === 'string'
              ? titleFail
              : titleFail(errString)
            : errString,
        );

        throw e;
      });
  }

  return new Promise<void>((res, rej) => {
    const proc = spawn(command, { shell: true });

    // Buffer which contains error data.
    let errBuf = Buffer.from([]);

    // When something was received from the error channel, we append it to the final buffer.
    proc.stderr.on('data', (buf: Buffer) => {
      errBuf = Buffer.concat([errBuf, buf]);

      // Update the spinner text to let user know, process is working.
      spinner.suffixText = chalk.bgGray.italic(buf.toString());
    });

    proc.on('exit', (code) => {
      // Drop process outputs.
      spinner.suffixText = '';

      // If an error code was not returned, it means the process completed successfully.
      if (!code) {
        spinner.succeed(titleSuccess as string);
        res();
        return;
      }

      const errString = errBuf.length ? errBuf.toString() : `Error code: ${code}`;
      const errorMessage = titleFail
        ? typeof titleFail === 'string'
          ? titleFail
          : titleFail(errString)
        : errString;

      spinner.fail(errorMessage);
      rej(new Error(errorMessage));
    });
  });
}
