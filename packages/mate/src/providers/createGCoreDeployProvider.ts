import type { DeployProvider } from './types.js';
import { GCoreAPI } from '../lib/GCoreAPI.js';

/**
 * Creates a deploy provider for GCore.
 * @param apiKey - GCore API Key.
 */
export function createGCoreDeployProvider(apiKey: string): DeployProvider {
  const api = new GCoreAPI(apiKey);

  return {
    async getLink(project) {
      const resources = await api.getCDNResources();
      for (const resource of resources) {
        if (resource.cname.startsWith(project + '.')) {
          return `https://${resource.cname}`;
        }
      }
    },
  };
}