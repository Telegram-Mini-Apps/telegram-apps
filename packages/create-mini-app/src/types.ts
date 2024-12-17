import type { Status } from '@inquirer/core';

export type CustomTheme = {
  spinner: {
    /**
     * The time interval between frames, in milliseconds.
     *
     * @defaultValue
     * ```ts
     * 80
     * ```
     */
    interval: number;
    /**
     * A list of frames to show for the spinner.
     *
     * @defaultValue
     * ```ts
     * ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
     * ```
     */
    frames: string[];
  };
  style: {
    /**
     * Style to apply to the user's answer once it has been submitted.
     *
     * @param text - The user's answer.
     * @returns The styled answer.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.cyan(text)
     * ```
     */
    answer: (text: string) => string;
    /**
     * Style to apply to the message displayed to the user.
     *
     * @param text - The message to style.
     * @param status - The current status of the prompt.
     * @returns The styled message.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text, status) => colors.bold(text)
     * ```
     */
    message: (text: string, status: Status) => string;
    /**
     * Style to apply to error messages.
     *
     * @param text - The error message.
     * @returns The styled error message.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.red(`> ${text}`)
     * ```
     */
    error: (text: string) => string;
    /**
     * Style to apply to the default answer when one is provided.
     *
     * @param text - The default answer.
     * @returns The styled default answer.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.dim(`(${text})`)
     * ```
     */
    defaultAnswer: (text: string) => string;
    /**
     * Style to apply to help text.
     *
     * @param text - The help text.
     * @returns The styled help text.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.dim(text)
     * ```
     */
    help: (text: string) => string;
    /**
     * Style to apply to highlighted text.
     *
     * @param text - The text to highlight.
     * @returns The highlighted text.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.cyan(text)
     * ```
     */
    highlight: (text: string) => string;
    /**
     * Style to apply to keyboard keys referred to in help texts.
     *
     * @param text - The key to style.
     * @returns The styled key.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => colors.cyan(colors.bold(`<${text}>`))
     * ```
     */
    key: (text: string) => string;
    success(text: string): string;
    placeholder(text: string): string;
    warning(text: string): string;
  };
  prefix: {
    idle: string;
    done: string;
    pointer: string;
  };
};