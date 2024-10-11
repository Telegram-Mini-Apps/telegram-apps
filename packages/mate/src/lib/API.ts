import { z } from 'zod';

import {
  ERR_FETCH_FAILED,
  ERR_RESPONSE_NOT_JSON,
  ERR_RESPONSE_NOT_OK,
  ERR_UNEXPECTED_RESPONSE,
} from '@/errors/errors.js';
import { TypedError } from '@/errors/TypedError.js';

export class API {
  constructor(
    private readonly baseUrl: string,
    private readonly deployKey: string,
  ) {
  }

  /**
   * Performs a request.
   * @param url - URL to send request to.
   * @param parser - response parser.
   * @param init - additional request options.
   * @throws {TypedError} ERR_FETCH_FAILED
   * @throws {TypedError} ERR_RESPONSE_NOT_OK
   * @throws {TypedError} ERR_RESPONSE_NOT_JSON
   */
  private async fetch<R>(
    url: string,
    parser: { parse(value: unknown): R },
    init?: RequestInit,
  ): Promise<R> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${url}`, {
        ...init,
        headers: {
          authorization: `deployKey ${this.deployKey}`,
          ...init?.headers,
        },
      });
    } catch (cause) {
      throw new TypedError(ERR_FETCH_FAILED, { cause });
    }
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const message = isJson
        ? await response
          .json()
          .then(
            v => z.object({
              type: z.string(),
              message: z.string().optional(),
            }).parse(v),
          )
          .then(e => e.message || e.type)
          .catch(() => response.text())
          .catch(() => undefined)
        : await response
          .text()
          .catch(() => undefined);

      throw new TypedError(ERR_RESPONSE_NOT_OK, message);
    }

    if (!isJson) {
      throw new TypedError(ERR_RESPONSE_NOT_JSON, `Content type: ${contentType || 'unknown'}`);
    }

    return response
      .json()
      .catch((cause) => {
        throw new TypedError(ERR_RESPONSE_NOT_JSON, { cause });
      })
      .then(v => parser.parse(v))
      .catch(cause => {
        throw new TypedError(ERR_UNEXPECTED_RESPONSE, { cause });
      });
  }

  /**
   * Deploys specified project files.
   * @param projectId - project name.
   * @param tag - deploy tag.
   * @param archive - archive with files.
   */
  deployProject(
    projectId: number,
    tag: string,
    archive: Buffer,
  ): Promise<{ assets: { path: string; url: string }[] }> {
    const formData = new FormData();
    formData.append('file', new Blob([archive], { type: 'application/x-gzip' }));

    return this.fetch(
      `/projects/${projectId}/deploy?tag=${tag}`,
      z.object({
        assets: z.array(
          z.object({
            path: z.string(),
            url: z.string(),
          }),
        ),
      }),
      { method: 'POST', body: formData },
    );
  }

  /**
   * @returns project deploy information.
   * @param projectId - project identifier.
   * @param tag - deployment version tag.
   */
  getProjectDeploymentInfo(projectId: number, tag: string): Promise<{
    allowedExtensions: string[];
    basePath: string;
    project: {
      title: string;
    };
    maxSize: number;
    maxFilesCount: number;
  }> {
    return this.fetch(`/projects/${projectId}/deploy?tag=${tag}`, z.object({
      allowedExtensions: z.array(z.string()),
      basePath: z.string(),
      project: z.object({
        title: z.string(),
      }),
      maxSize: z.number(),
      maxFilesCount: z.number(),
    }));
  }
}