/**
 * Timezones list
 * GET /dictionaries/timezones
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({});

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'timezones',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/dictionaries/timezones',
};

export const tool = {
  name: 'kinescope_timezones_timezones_list_timezones',
  description: 'Timezones list: GET /dictionaries/timezones',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/dictionaries/timezones`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
