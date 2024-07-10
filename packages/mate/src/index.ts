#!/usr/bin/env node
import { program } from 'commander';

import { deployCommand } from './commands/deployCommand.js';
import { linkCommand } from './commands/linkCommand.js';

import packageJson from '../package.json';

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .addCommand(linkCommand)
  .addCommand(deployCommand);

program.parse();