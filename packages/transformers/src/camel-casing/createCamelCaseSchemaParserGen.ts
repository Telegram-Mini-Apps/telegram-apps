import { type BaseIssue, type BaseSchema, InferOutput, parse, pipe } from 'valibot';
import type { DeepConvertSnakeKeysToCamelCase } from '@telegram-apps/toolkit';
import { conditionalSnakeKeys } from '@/camel-casing/conditionalSnakeKeys.js';

export interface CamelCaseSchemaParser<Input, Output extends object> {
  (input: Input, camelCase?: false): Output;
  (input: Input, camelCase: true): DeepConvertSnakeKeysToCamelCase<Output>;
}

export function createCamelCaseSchemaParserGen<
  Input,
  Schema extends BaseSchema<Input, object, BaseIssue<unknown>>
>(schema: Schema): CamelCaseSchemaParser<Input, InferOutput<Schema>> {
  return ((input, camelCase?) => parse(
    pipe(schema, conditionalSnakeKeys(camelCase)),
    input
  )) as CamelCaseSchemaParser<Input, InferOutput<Schema>>;
}