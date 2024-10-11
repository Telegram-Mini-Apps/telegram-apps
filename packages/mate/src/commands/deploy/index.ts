import { Command } from 'commander';

import { info } from '@/commands/deploy/info.js';
import { upload } from '@/commands/deploy/upload.js';

export const deploy = new Command()
  .name('deploy')
  .description('Group of commands related to deploying mini applications')
  .addCommand(info)
  .addCommand(upload);