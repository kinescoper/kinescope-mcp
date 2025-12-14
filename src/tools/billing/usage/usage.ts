/**
 * Usage
 * GET /billing/usage
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    from: z.string().optional().describe('from'),
    to: z.string().optional().describe('to'),
    group_by: z.string().optional().describe('Available values: project_id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'usage',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/billing/usage',
};

export const tool = {
  name: 'kinescope_usage_usage_usage',
  description: 'Usage: GET /billing/usage',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.from) {
    params.append('from', validatedArgs.from.toString());
  }
  if (validatedArgs.to) {
    params.append('to', validatedArgs.to.toString());
  }
  if (validatedArgs.group_by) {
    params.append('group_by', validatedArgs.group_by.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/billing/usage?${queryString}` : `/billing/usage`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
