export interface CamelCaseTransformerFn<Default, CamelCased> {
  (camelCase?: false): Default;
  (camelCase: true): CamelCased;
}