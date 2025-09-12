import { createQueryCamelCaseGen } from '@/camel-casing/createQueryCamelCaseGen.js';
import { LaunchParamsSchema } from '@/schemas/LaunchParamsSchema.js';

export const launchParamsQuery = createQueryCamelCaseGen(LaunchParamsSchema);
