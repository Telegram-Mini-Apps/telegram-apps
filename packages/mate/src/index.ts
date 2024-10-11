#!/usr/bin/env node
import { program } from 'commander';

import { deploy } from '@/commands/deploy/index.js';

import packageJson from '../package.json';

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)
  .addCommand(deploy);

program.parse();