type UnionKeys<T> = T extends T ? keyof T : never;

export interface CreateParams<Params = never, VersionedParam extends UnionKeys<Params> = never> {
  params: Params;
  versionedParams: VersionedParam;
}