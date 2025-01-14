import { createCamelCaseSchemaParserGen } from '@/camel-casing/createCamelCaseSchemaParserGen.js';
import type { CamelCaseQueryTransformerPipe } from '@/camel-casing/createQueryCamelCaseGen.js';
import { LaunchParamsSchema } from '@/schemas/LaunchParamsSchema.js';
import { launchParamsQuery } from '@/generators/launchParamsQuery.js';

export const parseLaunchParams = createCamelCaseSchemaParserGen<
  string | URLSearchParams,
  CamelCaseQueryTransformerPipe<typeof LaunchParamsSchema, false>
>(launchParamsQuery());