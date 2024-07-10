#!/usr/bin/env node
import { program } from 'commander';

import { linkCommand } from './commands/linkCommand.js';

import packageJson from '../package.json';

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .addCommand(linkCommand);

program.parse();