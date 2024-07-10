import { S3 } from '@aws-sdk/client-s3';

import type { DeployProvider } from './types.js';
import { GCoreAPI } from '../lib/GCoreAPI.js';

interface Options {
  apiKey: string;
  s3: {
    bucket: string;
    endpoint: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * Creates a deploy provider for GCore.
 * @param s3Options
 * @param options
 */
export function createGCoreDeployProvider({ s3: s3Options, ...options }: Options): DeployProvider {
  const api = new GCoreAPI(options.apiKey);
  const s3 = new S3({
    region: s3Options.region,
    endpoint: s3Options.endpoint,
    credentials: {
      accessKeyId: s3Options.accessKeyId,
      secretAccessKey: s3Options.secretAccessKey,
    },
  });

  return {
    async getLink(project) {
      const isDeployed = await s3.listObjects({
        Bucket: s3Options.bucket,
        Prefix: `${project}/`,
        MaxKeys: 1,
      }).then(d => !!d.Contents?.length);
      if (!isDeployed) {
        return;
      }

      const resources = await api.getCDNResources();
      if (resources.length > 0) {
        return `https://${resources[0].cname}/${s3Options.bucket}/${project}`;
      }
    },
  };
}