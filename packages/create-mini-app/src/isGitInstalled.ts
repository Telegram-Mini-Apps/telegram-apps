import { spawn } from 'node:child_process';

/**
 * @returns Promise with true if git is currently installed.
 */
export function isGitInstalled(): Promise<boolean> {
  return new Promise((res) => {
    spawn('git --version', { shell: true }).on('exit', (code) => {
      res(!code);
    });
  });
}
