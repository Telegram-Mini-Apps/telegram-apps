import process from 'node:process';

import { hl } from '@/chalk/hl.js';
import type { Config } from '@/config.js';
import type { Logger } from '@/logging.js';

import type { CommandOptions, OmitMerge } from './types.js';

interface ProjectBaseProps {
  endpoint: string;
  project: number;
  token: string;
  tag: string;
}

/**
 * Calculates default deploy properties.
 * @param defaults - default values for some of the props.
 */
export function injectDeployBaseProps<O extends CommandOptions<Partial<ProjectBaseProps>, {
  config?: Config;
  logger?: Logger;
  verboseLogger?: Logger;
}>>(defaults: { endpoint: string; tag: string }) {
  return (options: O): OmitMerge<O, ProjectBaseProps> => {
    const {
      logger,
      verboseLogger,
      config: {
        deploy: config = {},
      } = {},
    } = options;

    const projectId = options.args.project || config.projectId;
    if (!projectId) {
      logger?.error(
        'Unable to determine target project. Consider using the related command option or specifying a value in the mate config file',
      );
      // todo: throw?
      process.exit(1);
    }
    verboseLogger?.debug('Using project ID:', hl(projectId));

    const token = options.args.token || config.token;
    if (!token) {
      logger?.error('Project deploy token is missing. Use the --token option or config file to specify it');
      // todo: throw?
      process.exit(1);
    }
    verboseLogger?.debug('Using token:', hl(token));

    const endpoint = options.args.endpoint || config.endpoint || defaults.endpoint;
    verboseLogger?.debug('Using endpoint:', hl(endpoint));

    const tag = options.args.tag || config.tag || defaults.tag;
    verboseLogger?.debug('Using tag:', hl(tag));

    return {
      ...options,
      project: projectId,
      token,
      tag,
      endpoint,
    };
  };
}