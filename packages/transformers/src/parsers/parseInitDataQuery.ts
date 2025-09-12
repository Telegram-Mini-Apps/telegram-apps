import { InitDataQuerySchema } from '@/schemas/init-data.js';
import type { CamelCaseQueryTransformerPipe } from '@/camel-casing/createQueryCamelCaseGen.js';
import { createCamelCaseSchemaParserGen } from '@/camel-casing/createCamelCaseSchemaParserGen.js';
import { initDataQuery } from '@/generators/init-data.js';

export const parseInitDataQuery = createCamelCaseSchemaParserGen<
  string | URLSearchParams,
  CamelCaseQueryTransformerPipe<typeof InitDataQuerySchema, false>
>(initDataQuery());
