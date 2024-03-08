import { spawn } from 'node:child_process';

import chalk from 'chalk';
import ora from 'ora';

interface Options {
  /**
   * Shell command to run.
   */
  command: string;
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

/**
 * Spawns new process with spinner.
 * @param options - function options.
 */
export function spawnWithSpinner(options: Options): Promise<void> {
  const {
    command,
    title,
    titleFail,
    titleSuccess,
  } = options;
  const spinner = ora({ text: title, hideCursor: false }).start();

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
        spinner.succeed(titleSuccess);
        res();
        return;
      }

      const errString = errBuf.length ? errBuf.toString() : `Action error code: ${code}`;
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
