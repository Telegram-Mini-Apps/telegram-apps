import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';
import { TypedError } from '@/errors/TypedError.js';
import { ERR_CONFIG_INVALID, ERR_CONFIG_NOT_FOUND } from '@/errors/errors.js';

export interface Config {
  /**
   * Deploy related config.
   */
  deploy?: {
    /**
     * Directory to deploy.
     */
    directory?: string;
    /**
     * Custom API endpoint.
     */
    endpoint?: string;
    /**
     * Project identifier.
     */
    projectId?: number;
    /**
     * Deploy tag.
     */
    tag?: string;
    /**
     * Deploy token.
     */
    token?: string;
  };
}

/**
 * Reads config file using the specified path.
 * @param path - path to read config from.
 */
export function readConfig(path: string): Config | undefined {
  let content: string;
  try {
    content = readFileSync(path, 'utf-8');
  } catch (cause) {
    throw new TypedError(
      ERR_CONFIG_NOT_FOUND,
      `Unable to read config file by path: ${path}`,
      cause,
    );
  }

  let data: unknown;
  try {
    data = yaml.load(content);
  } catch {
    try {
      data = JSON.parse(content);
    } catch {
    }
  }

  try {
    return z.object({
      deploy: z
        .object({
          projectId: z.number().optional(),
          directory: z.string().optional(),
          endpoint: z.string().optional(),
          tag: z.string().optional(),
          token: z.string().optional(),
        })
        .optional(),
    }).parse(data);
  } catch (cause) {
    throw new TypedError(
      ERR_CONFIG_INVALID,
      `Config has invalid content. Path: ${path}`,
      cause,
    );
  }
}

interface Options {
  onInvalid?(path: string): void;
  path?: string;
}

export function retrieveConfig(options: Options = {}): Config | undefined {
  const { path } = options;
  if (path) {
    return readConfig(path);
  }
  for (const filename of ['mate.yml', 'mate.yaml', 'mate.json']) {
    const path = resolve(filename);

    try {
      return readConfig(path);
    } catch {
      if (existsSync(path)) {
        options.onInvalid?.(path);
      }
    }
  }
}