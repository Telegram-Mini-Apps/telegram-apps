const baseUrl = 'https://api.gcore.com';

export class GCoreAPI {
  constructor(private readonly apiKey: string) {
  }

  private async fetch<R>(url: string): Promise<R> {
    return fetch(`${baseUrl}${url}`, {
      headers: {
        Authorization: `APIKey ${this.apiKey}`,
      },
    }).then(r => r.json() as R);
  }

  /**
   * @see https://api.gcore.com/docs/cdn#tag/CDN-resources/operation/get_resources
   */
  getCDNResources(): Promise<{
    cname: string;
    deleted: boolean;
    id: number;
  }[]> {
    return this.fetch('/cdn/resources');
  }

  /**
   * @see https://api.gcore.com/docs/storage#tag/Storage/operation/storageListHttpV2
   */
  listStorages(): Promise<{
    data: {
      address: string;
      client_id: number;
      location: string;
      name: string;
      type: 'sftp' | 's3' | string;
    }[];
  }> {
    return this.fetch('/storage/provisioning/v2/storage');
  }
}