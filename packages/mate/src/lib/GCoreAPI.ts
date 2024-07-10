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

  getCDNResources(): Promise<{
    id: number;
    cname: string;
    deleted: boolean;
  }[]> {
    return this.fetch('/cdn/resources');
  }
}