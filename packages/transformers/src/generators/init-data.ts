import { createJsonCamelCaseGen } from '@/camel-casing/createJsonCamelCaseGen.js';
import {
  InitDataChatSchema,
  InitDataQuerySchema,
  InitDataUserSchema,
} from '@/schemas/init-data.js';
import { createQueryCamelCaseGen } from '@/camel-casing/createQueryCamelCaseGen.js';

export const initDataChatJson = createJsonCamelCaseGen(InitDataChatSchema);

export const initDataUserJson = createJsonCamelCaseGen(InitDataUserSchema);

export const initDataQuery = createQueryCamelCaseGen(InitDataQuerySchema);